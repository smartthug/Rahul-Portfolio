"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, Suspense } from "react";
import * as THREE from "three";

/**
 * A premium WebGL scene used as the cinematic background of the hero.
 * - Distorted noise sphere with custom fragment shader (iridescent gradient)
 * - Rotating ring of glowing particles
 * - Subtle mouse parallax
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;
  uniform vec2  uMouse;
  varying vec3  vNormal;
  varying vec3  vPosition;
  varying float vNoise;

  // 3D simplex noise (Ashima)
  vec3 mod289(vec3 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 =   v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    float n = snoise(pos * 1.4 + vec3(uTime * 0.22, uTime * 0.16, 0.0));
    float n2 = snoise(pos * 3.0 + vec3(uTime * 0.4));
    float displacement = (n * 0.55 + n2 * 0.18) * uDistort;
    pos += normal * displacement;
    pos.x += uMouse.x * 0.12;
    pos.y += uMouse.y * 0.12;
    vNoise = n;
    vNormal = normalize(normalMatrix * normal);
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vNoise;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fres = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.4);
    float t = 0.5 + 0.5 * sin(uTime * 0.4 + vNoise * 2.5);
    vec3 base = mix(uColorA, uColorB, smoothstep(-0.3, 0.6, vNoise));
    base = mix(base, uColorC, t * 0.55);
    vec3 col = base + fres * vec3(1.0, 0.95, 0.85) * 0.45;
    col += vec3(0.92, 0.35, 0.22) * smoothstep(0.6, 0.95, fres) * 0.4;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function DistortSphere() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDistort: { value: 0.45 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorA: { value: new THREE.Color("#efe7d6") },
      uColorB: { value: new THREE.Color("#b7ab98") },
      uColorC: { value: new THREE.Color("#eb5939") },
    }),
    []
  );

  useFrame((state, dt) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += dt;
      target.current.set(state.pointer.x, state.pointer.y);
      mouse.current.lerp(target.current, 0.06);
      matRef.current.uniforms.uMouse.value.copy(mouse.current);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.07;
      meshRef.current.rotation.x = mouse.current.y * 0.25;
    }
  });

  const scale = Math.min(viewport.width, viewport.height) * 0.45;

  return (
    <mesh ref={meshRef} scale={scale} position={[0.6, 0, 0]}>
      <icosahedronGeometry args={[1, 64]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        toneMapped={false}
      />
    </mesh>
  );
}

function ParticleRing() {
  const ref = useRef<THREE.Points>(null);
  const { positions, sizes } = useMemo(() => {
    const N = 1600;
    const positions = new Float32Array(N * 3);
    const sizes = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const r = 2.4 + Math.random() * 1.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * 0.45;
      positions[i * 3 + 0] = Math.cos(theta) * r;
      positions[i * 3 + 1] = phi * r * 0.6;
      positions[i * 3 + 2] = Math.sin(theta) * r;
      sizes[i] = Math.random() * 1.2 + 0.4;
    }
    return { positions, sizes };
  }, []);

  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.x = Math.sin(performance.now() * 0.0002) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        sizeAttenuation
        color="#0d0d0d"
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </points>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 4, 4]} intensity={2.0} color="#eb5939" />
      <pointLight position={[-5, -3, 2]} intensity={1.6} color="#f6f1e8" />
      <pointLight position={[0, 2, -5]} intensity={1.0} color="#b7ab98" />
    </>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5], fov: 38 }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <Lights />
        <DistortSphere />
        <ParticleRing />
      </Suspense>
    </Canvas>
  );
}
