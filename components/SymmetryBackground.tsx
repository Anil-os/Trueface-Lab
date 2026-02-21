'use client';

import React, { useEffect, useRef } from 'react';

// Background-only version of the symmetry engine
export const SymmetryBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        // Dynamically load the Three.js script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            const THREE = (window as any).THREE;
            const currentMount = mountRef.current;
            if (!currentMount) return;

            // --- Scene Setup ---
            const scene = new THREE.Scene();
            const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            currentMount.appendChild(renderer.domElement);

            // --- Kaleidoscopic Shader ---
            const fragmentShader = `
                uniform vec2 u_resolution;
                uniform float u_time;
                uniform vec2 u_mouse;
                varying vec2 vUv;

                #define MAX_STEPS 100
                #define MAX_DIST 100.0
                #define SURF_DIST 0.001

                // --- Rotation Matrix ---
                mat2 rot(float a) {
                    float s = sin(a);
                    float c = cos(a);
                    return mat2(c, -s, s, c);
                }

                // --- Signed Distance Function for the core shape ---
                float sdSphere(vec3 p, float s) {
                    return length(p) - s;
                }

                // --- The main scene function ---
                float map(vec3 p) {
                    vec3 p_orig = p;
                    
                    for (int i = 0; i < 8; i++) {
                        p = abs(p);
                        p -= vec3(0.5, 0.5, 0.2);
                        p.xy *= rot(u_time * 0.1);
                        p.yz *= rot(u_time * 0.15);
                    }
                    
                    return sdSphere(p, 0.3);
                }

                // --- Ray Marching Core ---
                vec4 rayMarch(vec3 ro, vec3 rd) {
                    float dO = 0.0;
                    vec3 p = ro;
                    for(int i = 0; i < MAX_STEPS; i++) {
                        p = ro + rd * dO;
                        float dS = map(p);
                        dO += dS;
                        if(dO > MAX_DIST || dS < SURF_DIST) break;
                    }
                    return vec4(dO, p);
                }

                // --- Normal Calculation for Lighting ---
                vec3 getNormal(vec3 p) {
                    vec2 e = vec2(0.001, 0.0);
                    float d = map(p);
                    vec3 n = d - vec3(map(p - e.xyy), map(p - e.yxy), map(p - e.yyx));
                    return normalize(n);
                }

                void main() {
                    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

                    vec3 ro = vec3(0.0, 0.0, 3.0);
                    vec3 rd = normalize(vec3(uv, -1.0));

                    ro.xy *= rot(u_mouse.x * 3.14);
                    ro.yz *= rot(u_mouse.y * 3.14);

                    vec4 res = rayMarch(ro, rd);
                    float d = res.x;
                    vec3 p = res.yzw;

                    vec3 col = vec3(0.0);

                    if(d < MAX_DIST) {
                        vec3 normal = getNormal(p);
                        
                        vec3 color1 = 0.5 + 0.5 * cos(u_time * 0.5 + p.xyz * 0.8 + vec3(0,2,4));
                        vec3 color2 = 0.5 + 0.5 * cos(u_time * 0.3 + p.yzx * 1.2 + vec3(1,3,2));
                        
                        vec3 materialColor = mix(color1, color2, abs(normal.y));
                        col = materialColor * exp(-0.1 * d);
                    }
                    
                    gl_FragColor = vec4(col * 0.3, 1.0);
                }
            `;
            
            const planeGeometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    u_resolution: { value: new THREE.Vector2(currentMount.clientWidth, currentMount.clientHeight) },
                    u_time: { value: 0.0 },
                    u_mouse: { value: new THREE.Vector2() }
                },
                fragmentShader,
            });
            const plane = new THREE.Mesh(planeGeometry, material);
            scene.add(plane);

            // --- Mouse Interaction ---
            const handleMouseMove = (event: MouseEvent) => {
                material.uniforms.u_mouse.value.x = (event.clientX / window.innerWidth) - 0.5;
                material.uniforms.u_mouse.value.y = (event.clientY / window.innerHeight) - 0.5;
            };
            window.addEventListener('mousemove', handleMouseMove);

            // --- Animation Loop ---
            const clock = new THREE.Clock();
            const animate = () => {
                requestAnimationFrame(animate);
                material.uniforms.u_time.value = clock.getElapsedTime();
                renderer.render(scene, camera);
            };
            animate();
            
            // Cleanup
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                if (currentMount && renderer.domElement) {
                    currentMount.removeChild(renderer.domElement);
                }
            };
        };

        return () => {
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <div 
            ref={mountRef} 
            className="absolute inset-0 w-full h-full opacity-40"
            style={{ 
                filter: 'blur(2px)',
                pointerEvents: 'none'
            }}
        />
    );
};
