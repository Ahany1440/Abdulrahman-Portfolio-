"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export const HERO_READY_EVENT = "hero:particles-ready";

type Options = {
  /** Height / width of the sampled name block. */
  aspect: number;
  reduced: boolean;
  mobile: boolean;
};

/**
 * Drives the hero particle field: the swirl-in intro, the magnetic cursor and the scroll breakup.
 * Returns the uniforms object to hand to the shader material.
 */
export function useParticleHero({ aspect, reduced, mobile }: Options) {
  const { camera, size, gl, invalidate } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uScatter: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: mobile ? 38 : 34 },
      uScale: { value: 6 },
      uOffsetY: { value: 0.4 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uMouseRadius: { value: 0.75 },
      uColor: { value: new THREE.Color(0.78, 0.82, 0.9) },
      uHot: { value: new THREE.Color(1.6, 1.75, 2.1) },
    }),
    // Uniforms are created once; values are mutated in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const view = useRef({ w: 10, h: 6 });
  const pointer = useRef({ target: new THREE.Vector2(99, 99), strength: 0, goal: 0, lastMove: 0 });

  // Fit the name to the viewport: wide screens are height-limited, phones are width-limited.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * cam.position.z;
    const w = h * (size.width / size.height);
    view.current = { w, h };
    const portrait = size.width / size.height < 0.9;
    const textW = portrait ? w * 0.92 : Math.min(w * 0.8, (h * 0.4) / aspect);
    uniforms.uScale.value = textW;
    uniforms.uOffsetY.value = portrait ? h * 0.12 : h * 0.09;
    uniforms.uMouseRadius.value = textW * 0.1;
    uniforms.uPixelRatio.value = gl.getPixelRatio();
    invalidate();
  }, [camera, size, gl, aspect, uniforms, invalidate]);

  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") (window as unknown as { __hero: unknown }).__hero = uniforms;

  // Intro and scroll choreography.
  useGSAP(() => {
    window.dispatchEvent(new Event(HERO_READY_EVENT));
    if (reduced) {
      invalidate();
      return;
    }
    gsap.to(uniforms.uIntro, { value: 1, duration: 3.4, ease: "power2.inOut", delay: 0.1 });
    gsap.to(uniforms.uScatter, {
      value: 1,
      ease: "none",
      scrollTrigger: { trigger: document.getElementById("hero"), start: "top top", end: "bottom top", scrub: 0.9 },
    });
    ScrollTrigger.refresh();
  }, []);

  // Cursor: map to the z=0 plane in world units.
  useEffect(() => {
    if (reduced || mobile) return;
    const onMove = (e: PointerEvent) => {
      const { w, h } = view.current;
      pointer.current.target.set((e.clientX / window.innerWidth - 0.5) * w, -(e.clientY / window.innerHeight - 0.5) * h);
      pointer.current.goal = 1;
      pointer.current.lastMove = performance.now();
    };
    const onLeave = () => (pointer.current.goal = 0);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, mobile]);

  useFrame((_, dt) => {
    if (reduced) return;
    const d = Math.min(dt, 1 / 30);
    uniforms.uTime.value += d;
    const p = pointer.current;
    // Particles drift home once the cursor rests.
    if (performance.now() - p.lastMove > 900) p.goal = 0;
    p.strength += (p.goal - p.strength) * (1 - Math.exp(-d * (p.goal > p.strength ? 6 : 1.6)));
    const m = uniforms.uMouse.value;
    const k = 1 - Math.exp(-d * 9);
    m.x += (p.target.x - m.x) * k;
    m.y += (p.target.y - m.y) * k;
    uniforms.uMouseStrength.value = p.strength * view.current.h * 0.12;
  });

  return uniforms;
}
