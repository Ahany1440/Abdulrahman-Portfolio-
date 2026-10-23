"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { buildParticles, fragmentShader, vertexShader, type ParticleData } from "./particles";
import { useParticleHero } from "@/hooks/useParticleHero";

type Props = { lines: string[]; reduced: boolean; mobile: boolean };

function Points({ data, reduced, mobile }: { data: ParticleData; reduced: boolean; mobile: boolean }) {
  const uniforms = useParticleHero({ aspect: data.aspect, reduced, mobile });

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(data.target, 3));
    g.setAttribute("aTarget", new THREE.BufferAttribute(data.target, 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(data.start, 3));
    g.setAttribute("aField", new THREE.BufferAttribute(data.field, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(data.rand, 4));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 60);
    return g;
  }, [data]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [uniforms],
  );

  useEffect(() => () => material.dispose(), [material]);

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/**
 * The fixed WebGL layer behind the hero and the start of the featured section.
 * Loaded lazily (see Hero.tsx). The render loop stops whenever the layer is out of play.
 */
export default function ParticleStage({ lines, reduced, mobile }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<ParticleData | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const family = getComputedStyle(document.body).fontFamily;
    const first = family.split(",")[0];
    document.fonts
      .load(`700 120px ${first}`)
      .catch(() => undefined)
      .then(() => {
        if (cancelled) return;
        setData(buildParticles(lines, family, mobile ? 14000 : 42000));
      });
    return () => {
      cancelled = true;
    };
  }, [lines, mobile]);

  useGSAP(
    () => {
      if (!data) return;
      const heroEl = document.getElementById("hero");
      const stageEl = document.getElementById("featured-stage") ?? document.getElementById("work");
      ScrollTrigger.create({
        trigger: heroEl,
        start: "top bottom",
        endTrigger: stageEl,
        end: "top top",
        onToggle: (self) => setActive(self.isActive),
      });
      gsap.fromTo(
        wrap.current,
        { autoAlpha: 1 },
        {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: stageEl, start: "top 85%", end: "top 10%", scrub: true },
        },
      );
      if (reduced) {
        // No breakup on scroll: the static frame simply fades as the hero leaves.
        gsap.to("#hero-canvas-dim", {
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: { trigger: heroEl, start: "top top", end: "bottom top", scrub: true },
        });
      }
    },
    { dependencies: [data], scope: wrap },
  );

  if (!data) return null;

  return (
    <div ref={wrap} className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={reduced ? "demand" : active ? "always" : "never"}
        dpr={mobile ? [1, 1.5] : [1, 1.75]}
        camera={{ fov: 35, position: [0, 0, 10], near: 0.1, far: 120 }}
        gl={{ antialias: false, alpha: false, powerPreference: "high-performance", stencil: false }}
        onCreated={({ gl }) => gl.setClearColor("#000000", 1)}
      >
        <Points data={data} reduced={reduced} mobile={mobile} />
        {!mobile && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.22} luminanceSmoothing={0.35} radius={0.72} />
          </EffectComposer>
        )}
      </Canvas>
      <div id="hero-canvas-dim" className="invisible absolute inset-0 bg-black opacity-0" />
    </div>
  );
}
