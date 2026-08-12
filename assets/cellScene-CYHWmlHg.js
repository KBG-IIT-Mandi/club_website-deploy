import{W as Je,S as et,P as tt,b as te,a as N,F as ot,V,M as ce,d as ze,e as U,p as Te,A as ue,g as Fe,I as at,q as st,Q as it,B as nt,m as rt,f as _e,r as lt,R as ct,s as p}from"./three.module-DRiFt6mT.js";function oe(g){let e=g>>>0;return()=>{e|=0,e=e+1831565813|0;let y=Math.imul(e^e>>>15,1|e);return y=y+Math.imul(y^y>>>7,61|y)^y,((y^y>>>14)>>>0)/4294967296}}function o(g){return(g()+g()+g())/1.5-1}const ut=[5136383,3721471,3074264,3997550,11075374,14090030,16761134,16742972,16729431],Be=`
  vec3 palPick(float seed) {
    float t = fract(seed * 9.73);
    vec3 c = uPal[0];
    c = mix(c, uPal[1], step(0.16, t));
    c = mix(c, uPal[2], step(0.30, t));
    c = mix(c, uPal[3], step(0.44, t));
    c = mix(c, uPal[4], step(0.62, t));
    c = mix(c, uPal[5], step(0.78, t));
    c = mix(c, uPal[6], step(0.87, t));
    c = mix(c, uPal[7], step(0.93, t));
    c = mix(c, uPal[8], step(0.975, t));
    return c;
  }
`,Ae=()=>({value:ut.map(g=>new _e(g))}),We=`
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

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

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

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
`,mt=`
  uniform float uTime;
  uniform float uAmp;
  uniform vec3  uProbeDir;
  uniform float uProbeStrength;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vDisp;

  ${We}

  float membraneField(vec3 p, float t) {
    float n = snoise(p * 1.7 + vec3(0.0, t * 0.22, 0.0)) * 0.62
            + snoise(p * 4.1 - vec3(t * 0.15, 0.0, t * 0.1)) * 0.24;
    return n;
  }

  void main() {
    vec3 dir = normalize(position);
    float t = uTime;

    float n = membraneField(dir, t);

    /* the probe: the membrane swells toward the microscope tip */
    float facing = clamp(dot(dir, uProbeDir), -1.0, 1.0);
    float ang = acos(facing);
    float bulge = exp(-ang * ang * 9.0) * uProbeStrength * 0.34;

    float disp = uAmp * n + bulge;
    vec3 pos = position + dir * disp;

    /* forward-difference normal from the noise field (probe omitted — its
       lighting error is invisible at these amplitudes and saves 4 taps) */
    float e = 0.08;
    vec3 tang = normalize(cross(dir, abs(dir.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
    vec3 bitang = normalize(cross(dir, tang));
    vec3 dirT = normalize(dir + tang * e);
    vec3 dirB = normalize(dir + bitang * e);
    vec3 pT = dirT * (1.15 + uAmp * membraneField(dirT, t));
    vec3 pB = dirB * (1.15 + uAmp * membraneField(dirB, t));
    vec3 pC = dir * (1.15 + uAmp * n);
    vec3 nrm = normalize(cross(pT - pC, pB - pC));
    nrm *= sign(dot(nrm, dir));

    vDisp = n;
    vNormalW = normalize(mat3(modelMatrix) * nrm);
    vPosW = (modelMatrix * vec4(pos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,ft=`
  uniform vec3  uBio;
  uniform vec3  uData;
  uniform float uOpacity;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vDisp;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    vec3 n = normalize(vNormalW);

    float fres = pow(1.0 - abs(dot(viewDir, n)), 2.4);

    /* interior reads computational blue, the living rim reads GFP lime */
    vec3 col = mix(uData * 0.28, uBio, fres);
    col += uBio * smoothstep(0.45, 0.9, vDisp) * 0.12;

    float alpha = (0.16 + fres * 0.62) * uOpacity;
    gl_FragColor = vec4(col, alpha);
  }
`,vt=`
  attribute vec3 aPosA;
  attribute vec3 aPosB;
  attribute float aSeed;

  uniform float uTime;
  uniform float uStageMix;
  uniform float uSize;
  uniform float uDrift;
  uniform float uWave;
  uniform float uSwim;

  varying float vSeed;
  varying float vTwinkle;
  varying float vWave;
  varying vec3 vShapePos;

  void main() {
    vSeed = aSeed;

    vec3 pos = mix(aPosA, aPosB, uStageMix);

    /* THE SWIM — during the gamete band a travelling wave runs down the
       flagellum (amplitude grows tailward from the neck at x = -0.55),
       and the head recoils slightly in counterphase: real flagellar
       propulsion, not a wiggle. */
    float tailness = smoothstep(-0.7, 2.4, pos.x);
    pos.y += uSwim * sin(pos.x * 3.1 - uTime * 5.5) * tailness * 0.16;
    pos.z += uSwim * sin(pos.x * 2.3 - uTime * 5.5 + 1.3) * tailness * 0.05;
    pos.y -= uSwim * (1.0 - tailness) * sin(uTime * 5.5) * 0.02;

    /* morph energy: turbulence peaks mid-transition, so a stage change
       reads as a burst of activity, not a linear slide between layouts */
    float energy = uStageMix * (1.0 - uStageMix) * 4.0;
    pos.x += sin(uTime * 1.7 + aSeed * 91.0) * 0.11 * energy;
    pos.y += cos(uTime * 1.9 + aSeed * 57.0) * 0.11 * energy;
    pos.z += sin(uTime * 1.5 + aSeed * 23.0) * 0.11 * energy;

    /* small autonomous drift — alive, not frozen */
    pos.x += sin(uTime * 0.6 + aSeed * 43.0) * 0.022 * uDrift;
    pos.y += cos(uTime * 0.5 + aSeed * 91.0) * 0.022 * uDrift;
    pos.z += sin(uTime * 0.7 + aSeed * 17.0) * 0.022 * uDrift;

    /* Preserve the morphed model-space position for stage-specific staining
       in the fragment shader. In fusion this separates the pale sperm from
       the warm ovum even though both occupy one particle cloud. */
    vShapePos = pos;

    /* THE SIGNAL — diagonal brightness waves sweeping the code lattice */
    vWave = uWave * (0.5 + 0.5 * sin(uTime * 2.6 - (pos.x + pos.y * 0.8 + pos.z * 0.6) * 2.4));

    vTwinkle = 0.72 + 0.28 * sin(uTime * (1.2 + aSeed) + aSeed * 6.28);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (1.0 + vWave * 0.4) / max(0.5, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,pt=`
  uniform vec3 uBio;
  uniform vec3 uData;
  uniform vec3 uPal[9];
  uniform float uDataMix;
  uniform float uStageF;
  uniform float uOpacity;

  varying float vSeed;
  varying float vTwinkle;
  varying float vWave;
  varying vec3 vShapePos;

  ${Be}

  void main() {
    vec2 d = gl_PointCoord - vec2(0.5);
    float r2 = dot(d, d);
    if (r2 > 0.25) discard;
    float soft = smoothstep(0.25, 0.02, r2);

    /* each particle carries its own fluorophore channel; the finale still
       pulls the whole culture toward computational blue */
    vec3 col = palPick(vSeed);

    /* THE COLOUR MORPH — each life-form wears its own truth, cross-fading
       on the same clock as the shape (triangular weights peak on each
       stage's plateau). Per-particle brightness keeps the cloud alive:
         gamete   pale seminal white — sperm are white
         ovum     warm follicular gold
         embryo   soft vital rose
         organelle MitoTracker orange-red, the stain's own colour */
    float bright = 0.7 + 0.6 * fract(vSeed * 5.31);
    float wSperm = max(0.0, 1.0 - abs(uStageF - 3.0));
    float wOvum  = max(0.0, 1.0 - abs(uStageF - 4.0));
    float wEmb   = max(0.0, 1.0 - abs(uStageF - 5.0));
    float wMito  = max(0.0, 1.0 - abs(uStageF - 6.0));
    col = mix(col, vec3(0.93, 0.96, 1.0) * bright, wSperm * 0.9);
    col = mix(col, vec3(1.0, 0.72, 0.32) * bright, wOvum * 0.8);
    col = mix(col, vec3(1.0, 0.6, 0.52) * bright, wEmb * 0.75);
    col = mix(col, vec3(1.0, 0.42, 0.18) * bright, wMito * 0.8);

    /* The fertilizing sperm occupies the west side of S4 (x < -1.15).
       Restore its cool-white stain after the ovum's gold pass so the two
       biological actors remain legible as separate forms during contact. */
    float fusedSperm = wOvum * (1.0 - smoothstep(-1.18, -0.98, vShapePos.x));
    col = mix(col, vec3(0.9, 0.96, 1.0) * bright, fusedSperm * 0.96);

    col = mix(col, uData, uDataMix * 0.7);

    /* the wavefront brightens the lattice and flashes LIME at its crest:
       the biological signal running through the code — the thesis, lit */
    col *= 1.0 + vWave * 1.5;
    col = mix(col, uBio, smoothstep(0.72, 0.98, vWave));

    gl_FragColor = vec4(col, soft * vTwinkle * uOpacity * (0.85 + vWave * 0.5));
  }
`,dt=`
  uniform float uTime;

  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec4 world = instanceMatrix * vec4(position, 1.0);

    /* slow orbital sway around the nucleus */
    float a = uTime * 0.14;
    mat3 spin = mat3(
      cos(a), 0.0, sin(a),
      0.0,    1.0, 0.0,
     -sin(a), 0.0, cos(a)
    );
    world.xyz = spin * world.xyz;

    vNormalW = normalize(mat3(modelMatrix) * spin * mat3(instanceMatrix) * normal);
    vPosW = (modelMatrix * world).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * world;
  }
`,ht=`
  uniform vec3 uBio;
  uniform vec3 uData;
  uniform float uOpacity;

  varying vec3 vNormalW;
  varying vec3 vPosW;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosW);
    float fres = pow(1.0 - abs(dot(viewDir, normalize(vNormalW))), 2.0);
    vec3 col = mix(uData * 0.5, uBio * 0.85, fres);
    gl_FragColor = vec4(col, (0.12 + fres * 0.5) * uOpacity);
  }
`;function gt(g){const e=oe(20260810),y=[];{const i=new Float32Array(g*3);for(let r=0;r<g;r++)i[r*3]=o(e)*.42,i[r*3+1]=o(e)*.42,i[r*3+2]=o(e)*.42;y.push(i)}{const i=new Float32Array(g*3),r=[];for(let v=0;v<26;v++)r.push([(e()*2-1)*2.4,(e()*2-1)*1.5,(e()*2-1)*.9]);for(let v=0;v<g;v++){const m=r[e()*r.length|0];i[v*3]=m[0]+o(e)*.16,i[v*3+1]=m[1]+o(e)*.16,i[v*3+2]=m[2]+o(e)*.16}y.push(i)}{const i=new Float32Array(g*3);for(let r=0;r<g;r++)if(e()<.3)i[r*3]=o(e)*.22,i[r*3+1]=o(e)*.22,i[r*3+2]=o(e)*.22;else{let m=o(e),n=o(e),l=o(e);const a=Math.hypot(m,n,l)||1,s=1.05+(e()-.5)*.08;i[r*3]=m/a*s,i[r*3+1]=n/a*s,i[r*3+2]=l/a*s}y.push(i)}{const i=new Float32Array(g*3);for(let r=0;r<g;r++){const v=e();let m,n,l;if(v<.2)m=-1.5+o(e)*.3,n=o(e)*.22,l=o(e)*.13;else if(v<.34){const a=e(),s=e()*Math.PI*2,c=.085+(e()-.5)*.02;m=-1.16+a*.61,n=Math.cos(s)*c,l=Math.sin(s)*c}else if(v<.92){const a=e();m=-.55+a*3.15;const s=.05*(1-a)+.008;n=.18*Math.sin((m+.55)*2.2)+o(e)*s,l=o(e)*s}else m=(e()-.5)*4.5,n=o(e)*.8,l=o(e)*.8;i[r*3]=m-.4,i[r*3+1]=n,i[r*3+2]=l}y.push(i)}{const i=new Float32Array(g*3);for(let r=0;r<g;r++){const v=e();let m,n,l;if(v<.38){let a=o(e),s=o(e),c=o(e);const f=Math.hypot(a,s,c)||1,u=Math.cbrt(e())*1.16;m=a/f*u,n=s/f*u,l=c/f*u}else if(v<.56){let a=o(e),s=o(e),c=o(e);const f=Math.hypot(a,s,c)||1,u=1.32+(e()-.5)*.07;m=a/f*u,n=s/f*u,l=c/f*u}else if(v<.72){let a=o(e),s=o(e),c=o(e);const f=Math.hypot(a,s,c)||1,u=1.55+e()*.4;m=a/f*u+o(e)*.1,n=s/f*u+o(e)*.1,l=c/f*u+o(e)*.1}else if(v<.82)m=-1.48+o(e)*.18,n=.22+o(e)*.12,l=o(e)*.08;else{const a=e();m=-1.58-a*2.5;const s=.045*(1-a)+.008;n=.22+.3*Math.sin(a*5.2)*a+o(e)*s,l=o(e)*s}i[r*3]=m,i[r*3+1]=n,i[r*3+2]=l}y.push(i)}{const i=new Float32Array(g*3),r=(m,n,l,a,s)=>{const c=e();return[m+(l-m)*c+o(e)*s,n+(a-n)*c+o(e)*s,o(e)*s*1.6]},v=(m,n,l,a,s,c,f)=>{const u=e(),h=1-u;return[h*h*m+2*h*u*l+u*u*s+o(e)*f,h*h*n+2*h*u*a+u*u*c+o(e)*f,o(e)*f*1.6]};for(let m=0;m<g;m++){const n=e();let l,a,s;if(n<.13){const c=e()*Math.PI*2,f=.44+(e()-.5)*.05;l=-.18+Math.cos(c)*f,a=.62+Math.sin(c)*f*1.06,s=o(e)*.08}else if(n<.22)l=-.18+o(e)*.4,a=.62+o(e)*.42,s=o(e)*.3;else if(n<.25)[l,a,s]=r(-.6,.82,-.58,.36,.045),l-=Math.sin((a-.36)*3.2)*.07;else if(n<.4)[l,a,s]=v(.24,.94,.85,.12,.3,-.74,.08);else if(n<.52)l=.14+o(e)*.32,a=-.04+o(e)*.42,s=o(e)*.28;else if(n<.56)[l,a,s]=v(-.46,.28,-.5,-.2,-.02,-.52,.05);else if(n<.63)[l,a,s]=r(.26,-.56,-.26,-.4,.1);else if(n<.68)[l,a,s]=r(-.26,-.4,-.02,-.78,.075);else if(n<.71)l=.07+o(e)*.09,a=-.84+o(e)*.055,s=o(e)*.07;else if(n<.77)[l,a,s]=r(.1,.4,-.16,.1,.08);else if(n<.82)[l,a,s]=r(-.16,.1,-.48,.4,.065);else if(n<.85)l=-.53+o(e)*.075,a=.44+o(e)*.075,s=.04+o(e)*.06;else if(n<.96){let c=o(e),f=o(e),u=o(e);const h=Math.hypot(c,f,u)||1,x=1.5+(e()-.5)*.1;l=c/h*x*1.05,a=f/h*x*.95,s=u/h*x*.8}else l=o(e)*1.1,a=o(e)*1,s=o(e)*.7;i[m*3]=s*1.25,i[m*3+1]=a*1.25,i[m*3+2]=l*1.25}y.push(i)}{const i=new Float32Array(g*3),r=v=>.16*Math.sin(v*1.1);for(let v=0;v<g;v++){const m=e();let n,l,a;if(m<.3){let s=o(e),c=o(e),f=o(e);const u=Math.hypot(s,c,f)||1,h=.96+e()*.07;n=s/u*1.42*h,l=c/u*.6*h+r(n),a=f/u*.6*h}else if(m<.45){let s=o(e),c=o(e),f=o(e);const u=Math.hypot(s,c,f)||1;n=s/u*1.22,l=c/u*.5+r(n),a=f/u*.5}else if(m<.9){const c=-1.12+(e()*9|0)*.28,f=e()*Math.PI*2,u=Math.sqrt(e()),h=Math.cos(f)*u*.42,x=Math.sin(f)*u*.42;n=c+.09*Math.sin(h*9)+o(e)*.015,l=h+r(c),a=x}else n=(e()-.5)*2.4,l=o(e)*.4+r(n),a=o(e)*.4;i[v*3]=a,i[v*3+1]=l,i[v*3+2]=n}y.push(i)}{const i=new Float32Array(g*3),r=3,v=3.9,m=.62,n=30,l=2.1;for(let a=0;a<g;a++){const s=e(),c=e(),f=(c-.5)*v,u=c*r*Math.PI*2;if(s<.33)i[a*3]=Math.cos(u)*m+o(e)*.016,i[a*3+1]=f,i[a*3+2]=Math.sin(u)*m+o(e)*.016;else if(s<.66)i[a*3]=Math.cos(u+l)*m+o(e)*.016,i[a*3+1]=f,i[a*3+2]=Math.sin(u+l)*m+o(e)*.016;else{const h=((e()*n|0)/(n-1)-.5)*v,x=(h/v+.5)*r*Math.PI*2,b=Math.floor(e()*44)/43,M=Math.cos(x)*m,D=Math.sin(x)*m,q=Math.cos(x+l)*m,O=Math.sin(x+l)*m;i[a*3]=M+(q-M)*b+o(e)*.006,i[a*3+1]=h+o(e)*.006,i[a*3+2]=D+(O-D)*b+o(e)*.006}}y.push(i)}{const i=new Float32Array(g*3),r=.55,v=Math.cos(r),m=Math.sin(r);for(let n=0;n<g;n++){const l=e();let a,s,c;if(l<.82){let f=o(e),u=o(e),h=o(e);const x=Math.hypot(f,u,h)||1;f/=x,u/=x,h/=x;const b=1+.075*Math.sin(6*u+4*f)*Math.cos(5*h+2*u)+.05*Math.sin(11*f+7*h),M=.93+e()*.09;a=f*.95*b*M,s=u*.6*b*M,c=h*.8*b*M,s<-.32&&(s=-.32-(Math.abs(s)-.32)*.35),s>.05&&Math.abs(a)<.1&&(a+=(a>=0?1:-1)*.09),a+=(a>=0?1:-1)*.03}else if(l<.95){let f=o(e),u=o(e),h=o(e);const x=Math.hypot(f,u,h)||1;f/=x,u/=x,h/=x;const b=1+.05*Math.sin(26*u),M=.9+e()*.12;a=f*.42*b*M,s=-.48+u*.24*b*M,c=-.5+h*.34*b*M}else{const f=e(),u=(1-f*.55)*.11,h=e()*Math.PI*2;a=Math.cos(h)*u,s=-.4-f*.45,c=-.16+f*.26+Math.sin(h)*u}i[n*3]=a*v+c*m,i[n*3+1]=s,i[n*3+2]=-a*m+c*v}y.push(i)}return y}function De(){const g=getComputedStyle(document.documentElement),e=(y,i)=>{const r=g.getPropertyValue(y).trim();return new _e(r||i)};return{bio:e("--bio","#B6FF2E"),data:e("--data","#4FA8FF")}}const Oe={high:5600,low:2400};function yt(g,{quality:e="high"}={}){const y=new Je({canvas:g,alpha:!0,antialias:e==="high",powerPreference:"high-performance"});y.setClearColor(0,0);const i=new et,r=new tt(38,1,.1,120);r.position.set(0,0,4.4);const v=De(),m=new te(1.15,e==="high"?152:88,e==="high"?104:60),n=new N({uniforms:{uTime:{value:0},uAmp:{value:.1},uProbeDir:{value:new V(0,0,1)},uProbeStrength:{value:0},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uOpacity:{value:1}},vertexShader:mt,fragmentShader:ft,transparent:!0,depthWrite:!1,side:ot}),l=new ce(m,n);l.renderOrder=3,i.add(l);const a=Oe[e]||Oe.high,s=gt(a),c=new ze,f=new Float32Array(s[0]),u=new Float32Array(s[1]),h=new Float32Array(a);{const t=oe(11);for(let d=0;d<a;d++)h[d]=t()}c.setAttribute("position",new U(s[0].slice(),3)),c.setAttribute("aPosA",new U(f,3)),c.setAttribute("aPosB",new U(u,3)),c.setAttribute("aSeed",new U(h,1)),c.boundingSphere=new Te(new V(0,0,0),6);const x=new N({uniforms:{uTime:{value:0},uStageMix:{value:0},uSize:{value:e==="high"?11:9},uDrift:{value:1},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uPal:Ae(),uDataMix:{value:0},uStageF:{value:0},uWave:{value:0},uSwim:{value:0},uOpacity:{value:1}},vertexShader:vt,fragmentShader:pt,transparent:!0,depthWrite:!1,blending:ue}),b=new Fe(c,x);b.renderOrder=2,i.add(b);const M=new te(1,10,8),D=new N({uniforms:{uTime:{value:0},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uOpacity:{value:1}},vertexShader:dt,fragmentShader:ht,transparent:!0,depthWrite:!1}),q=e==="high"?18:0,O=new at(M,D,Math.max(1,q));O.count=q;{const t=oe(7),d=new st,w=new it,S=new V,W=new V;for(let T=0;T<q;T++){let E=o(t),F=o(t),P=o(t);const A=Math.hypot(E,F,P)||1,L=.55+t()*.38;W.set(E/A*L,F/A*L,P/A*L);const I=.05+t()*.09;S.set(I,I*(.7+t()*.6),I),d.compose(W,w,S),O.setMatrixAt(T,d)}}O.renderOrder=1,i.add(O);const Ee=`
    uniform float uTime;
    uniform float uProg;
    uniform float uOpacity;
    uniform vec3 uBio;
    uniform vec3 uData;
    varying vec3 vDir;

    ${We}

    void main() {
      float n = snoise(vDir * 2.3 + vec3(0.0, uTime * 0.015, uTime * 0.01)) * 0.6
              + snoise(vDir * 5.1 - vec3(uTime * 0.008, 0.0, 0.0)) * 0.4;
      n = n * 0.5 + 0.5;

      /* tissue-green atmosphere early; deep neural blue by the finale */
      vec3 tint = mix(mix(uBio, uData, 0.4), uData, smoothstep(0.84, 0.98, uProg));
      float glow = smoothstep(0.42, 0.95, n);
      vec3 col = tint * glow * 0.17 * (0.7 + 0.3 * vDir.y);
      gl_FragColor = vec4(col, uOpacity * glow * 0.5);
    }
  `,me=new te(30,32,24),C=new N({uniforms:{uTime:{value:0},uProg:{value:0},uOpacity:{value:.5},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:Ee,transparent:!0,depthWrite:!1,side:nt}),fe=new ce(me,C);fe.renderOrder=-2,i.add(fe);const Re=`
    varying vec2 vUv;
    void main() {
      /* billboard: anchor at the origin in view space, spread the quad */
      vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      mv.xy += position.xy * 8.5;
      vUv = position.xy;
      gl_Position = projectionMatrix * mv;
    }
  `,ke=`
    uniform float uTime;
    uniform float uFuse;
    varying vec2 vUv;
    void main() {
      float r = length(vUv) * 2.0;

      /* the core bloom — follicular gold, hot centre */
      float core = exp(-r * r * 7.0);

      /* two shockwave rings rolling outward, fading as they travel */
      float w1 = fract(uTime * 0.4);
      float ring1 = smoothstep(0.055, 0.0, abs(r - w1)) * (1.0 - w1);
      float w2 = fract(uTime * 0.4 + 0.5);
      float ring2 = smoothstep(0.055, 0.0, abs(r - w2)) * (1.0 - w2);

      /* A fine cortical ring stays locked to the zona while the broad zinc
         waves travel. The micro-pulse adds structure without another mesh. */
      float cortex = exp(-pow((r - 0.47) / 0.026, 2.0));
      cortex *= 0.78 + 0.22 * sin(r * 42.0 - uTime * 2.8);

      vec3 gold = vec3(1.0, 0.78, 0.38);
      vec3 spark = vec3(1.0, 0.96, 0.88);
      vec3 col = gold * (core * 0.9 + cortex * 0.36)
               + spark * (ring1 + ring2) * 0.85;
      float a = (core * 0.5 + cortex * 0.2 + (ring1 + ring2) * 0.46) * uFuse;
      gl_FragColor = vec4(col, a);
    }
  `,ve=new rt(1,1),X=new N({uniforms:{uTime:{value:0},uFuse:{value:0}},vertexShader:Re,fragmentShader:ke,transparent:!0,depthWrite:!1,depthTest:!1,blending:ue}),Y=new ce(ve,X);Y.renderOrder=4,Y.visible=!1,i.add(Y);const Ce=`
    attribute float aSeed;
    uniform float uTime;
    uniform float uProg;
    uniform float uSize;
    varying float vSeed;
    varying float vGlow;

    void main() {
      vSeed = aSeed;
      vec3 p = position;

      /* F0 — plankton rise: layered motes drifting slowly upward, wrapping */
      vec3 f0 = p;
      f0.y = mod(p.y + uTime * 0.45 + aSeed * 20.0, 20.0) - 10.0;
      f0.x += sin(uTime * 0.2 + p.y * 0.3 + aSeed * 6.28) * 0.8;
      f0.z += cos(uTime * 0.18 + p.x * 0.2) * 0.8;

      /* F1 — the current: motes stream sideways in layered ribbons */
      float flow = uTime * 0.6;
      vec3 f1 = vec3(
        mod(p.x + flow * 2.4 + aSeed * 48.0, 48.0) - 24.0,
        p.y * 0.3 + sin(p.z * 0.5 + flow + aSeed * 6.28) * 1.6,
        p.z * 0.85
      );

      /* F2 — orbitals: four tilted electron shells around the cell */
      float shell = floor(fract(aSeed * 7.31) * 4.0);
      float orad = 4.2 + shell * 2.6 + (fract(aSeed * 91.7) - 0.5) * 1.4;
      float oang = uTime * (0.5 - shell * 0.09) + aSeed * 6.28318;
      float tilt = shell * 0.55 - 0.8;
      vec3 f2 = vec3(
        cos(oang) * orad,
        sin(oang) * orad * sin(tilt),
        sin(oang) * orad * cos(tilt) * 0.5
      );

      /* F3 — the macro helix: the whole sky becomes the club's logo motif,
         a giant double helix wrapping the small one — with base-pair rungs */
      float side = step(0.5, fract(aSeed * 3.77));
      float hy = (fract(aSeed * 17.9) - 0.5) * 24.0;
      /* 2.1 rad backbone offset — the same B-DNA grooves as the small helix */
      float hang = hy * 0.5 + uTime * 0.3 + side * 2.1;
      float hr = 6.5 + (fract(aSeed * 29.3) - 0.5) * 1.2;
      vec3 f3 = vec3(cos(hang) * hr, hy, sin(hang) * hr);
      /* one mote in four becomes rung material: dense straight chords at
         quantized heights, so the macro ladder reads from any angle */
      float isRung = step(0.75, fract(aSeed * 53.1));
      float hyq = (floor(fract(aSeed * 17.9) * 18.0) / 17.0 - 0.5) * 24.0;
      float hangq = hyq * 0.5 + uTime * 0.3;
      float lerpT = floor(fract(aSeed * 7.7) * 30.0) / 29.0;
      vec3 rungP = vec3(
        mix(cos(hangq), cos(hangq + 2.1), lerpT) * hr,
        hyq,
        mix(sin(hangq), sin(hangq + 2.1), lerpT) * hr
      );
      f3 = mix(f3, rungP, isRung);

      /* F4 — the storm: a breathing vortex around the mind */
      float ang = uTime * 0.45 + aSeed * 6.28318 + length(p) * 0.3;
      float rr = 5.0 + fract(aSeed * 13.7 + uTime * 0.05) * 15.0;
      vec3 f4 = vec3(
        cos(ang) * rr,
        (aSeed - 0.5) * 12.0 + sin(uTime * 0.7 + aSeed * 9.0),
        sin(ang) * rr
      );

      /* five formations, four scroll-driven morphs */
      float w1 = smoothstep(0.1, 0.22, uProg);
      float w2 = smoothstep(0.28, 0.4, uProg);
      float w3 = smoothstep(0.78, 0.87, uProg);
      float w4 = smoothstep(0.91, 0.96, uProg);
      vec3 pos = mix(f0, f1, w1);
      pos = mix(pos, f2, w2);
      pos = mix(pos, f3, w3);
      pos = mix(pos, f4, w4);

      /* morph energy: every transition detonates a turbulence burst */
      float energy = w1 * (1.0 - w1) + w2 * (1.0 - w2) + w3 * (1.0 - w3) + w4 * (1.0 - w4);
      pos += vec3(
        sin(uTime * 2.1 + aSeed * 91.0),
        cos(uTime * 2.3 + aSeed * 57.0),
        sin(uTime * 1.9 + aSeed * 23.0)
      ) * energy * 2.4;

      /* universal turbulence so no formation ever freezes */
      pos.x += sin(uTime * 0.7 + aSeed * 91.0) * 0.4;
      pos.y += cos(uTime * 0.6 + aSeed * 47.0) * 0.4;
      pos.z += sin(uTime * 0.8 + aSeed * 23.0) * 0.4;

      vGlow = 0.5 + 0.5 * sin(uTime * (0.7 + aSeed * 1.8) + aSeed * 40.0) + energy * 1.3;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * (0.3 + aSeed * 1.2) / max(1.0, -mv.z * 0.22);
      gl_Position = projectionMatrix * mv;
    }
  `,Ge=`
    uniform vec3 uBio;
    uniform vec3 uData;
    uniform vec3 uPal[9];
    uniform float uOpacity;
    varying float vSeed;
    varying float vGlow;

    ${Be}

    void main() {
      vec2 d = gl_PointCoord - vec2(0.5);
      float r2 = dot(d, d);
      if (r2 > 0.25) discard;
      float soft = smoothstep(0.25, 0.03, r2);

      /* the ambient sea carries the same nine-channel stain, leaned cool:
         distant tissue reads blue-teal, warm reporters glint through rarely */
      vec3 col = mix(palPick(vSeed), uData, 0.35);

      gl_FragColor = vec4(col, soft * (0.1 + vGlow * 0.24) * uOpacity);
    }
  `,j=e==="high"?7e3:3e3,R=new ze;{const t=new Float32Array(j*3),d=new Float32Array(j),w=oe(990749);for(let S=0;S<j;S++){let W=o(w),T=o(w),E=o(w);const F=Math.hypot(W,T,E)||1,P=7+17*Math.pow(w(),.65);t[S*3]=W/F*P,t[S*3+1]=T/F*P*.8,t[S*3+2]=E/F*P,d[S]=w()}R.setAttribute("position",new U(t,3)),R.setAttribute("aSeed",new U(d,1)),R.boundingSphere=new Te(new V(0,0,0),40)}const G=new N({uniforms:{uTime:{value:0},uProg:{value:0},uSize:{value:e==="high"?26:22},uOpacity:{value:1},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uPal:Ae()},vertexShader:Ce,fragmentShader:Ge,transparent:!0,depthWrite:!1,blending:ue}),pe=new Fe(R,G);pe.renderOrder=0,i.add(pe);const Le=()=>{const t=De();for(const d of[n,x,D,C,G])d.uniforms.uBio.value.copy(t.bio),d.uniforms.uData.value.copy(t.data)},de=new MutationObserver(Le);de.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});let he=0,_=!1,ae=e==="high"?11:9,ge=.03,se=[0,1];const B={x:0,y:0,strength:0},k={x:0,y:0,strength:0},ie=new ct,xe=new lt,H=new V(0,0,1);let $=0,Q=!1,Z=!1,J=0,z=0,ne=null,ee=0,K=0;const Ie=(t,d)=>{se[0]===t&&se[1]===d||(se=[t,d],c.getAttribute("aPosA").array.set(s[t]),c.getAttribute("aPosB").array.set(s[d]),c.getAttribute("aPosA").needsUpdate=!0,c.getAttribute("aPosB").needsUpdate=!0)},Ne=()=>{const t=he,d=8,w=Math.min(d-.001,t*d),S=Math.min(d-1,Math.floor(w));Ie(S,S+1);const W=w-S;x.uniforms.uStageMix.value=p.smoothstep(W,.12,.88),x.uniforms.uStageF.value=S+p.smoothstep(W,.12,.88),x.uniforms.uSwim.value=p.smoothstep(t,.3,.36)*(1-p.smoothstep(t,.46,.52));const T=p.smoothstep(t,.455,.485)*(1-p.smoothstep(t,.555,.615));X.uniforms.uFuse.value=T,Y.visible=T>.01;const E=p.smoothstep(t,.02,.24),F=p.smoothstep(t,.8,.86)*(1-p.smoothstep(t,.92,.97)),P=p.smoothstep(t,.3,.36)*(1-p.smoothstep(t,.44,.5)),A=p.smoothstep(t,.44,.5)*(1-p.smoothstep(t,.54,.6)),L=p.smoothstep(t,.56,.62)*(1-p.smoothstep(t,.66,.72)),I=p.smoothstep(t,.68,.73)*(1-p.smoothstep(t,.79,.84)),re=p.clamp(1/r.aspect-1,0,1.4)/1.4,Ue=p.smoothstep(t,.9,.97),qe=re*(.4*p.smoothstep(t,.24,.4)+1*P+1.5*A+.9*L+1.2*I+1.8*F+1.6*Ue),je=1-p.smoothstep(t,.08,.28),He=_?1.4*je:0,$e=_?4.8*P:0,Qe=_?5.5*A:0,be=4.4-3.1*E+1.2*p.smoothstep(t,.3,.9)+1.7*F+1.4*P+3.4*A+2.6*L+1.9*I+qe+He+$e+Qe,le=.55*p.smoothstep(t,.16,.3)+.55*p.smoothstep(t,.3,.46)+.4*p.smoothstep(t,.5,.64)+.4*p.smoothstep(t,.66,.78)+2.2*p.smoothstep(t,.8,.92),Ke=_?-.34*A:0,Se=-.52*(1-.6*re)*p.smoothstep(t,.93,.985)*Math.cos(le)+Ke,Me=-.55*re*p.smoothstep(t,.06,.2);if(r.position.x=Math.sin(le)*be+Se,r.position.z=Math.cos(le)*be,r.position.y=Me+-.15*Math.sin(t*Math.PI)+.6*p.smoothstep(t,.3,.42)*(1-p.smoothstep(t,.52,.64)),r.lookAt(Se,Me,0),_){const Ze=1-.45*p.smoothstep(t,.08,.3);r.rotateZ(p.degToRad(-11)*Ze)}n.uniforms.uOpacity.value=1-p.smoothstep(t,.08,.26),l.visible=n.uniforms.uOpacity.value>.01;const Xe=1+E*2.2;l.scale.setScalar(Xe),D.uniforms.uOpacity.value=n.uniforms.uOpacity.value,O.visible=l.visible,x.uniforms.uDataMix.value=p.smoothstep(t,.92,.99),x.uniforms.uDrift.value=1-.6*p.smoothstep(t,.93,.99),x.uniforms.uWave.value=p.smoothstep(t,.93,.99);const Pe=p.smoothstep(t,.8,.86)*(1-p.smoothstep(t,.9,.96));ge=.03+.09*Pe,x.uniforms.uSize.value=ae*(1+.6*p.smoothstep(t,.1,.5)+.35*Pe+.45*p.smoothstep(t,.93,1)+(_?.45*P+1*A:0));const Ye=1-p.smoothstep(t,.05,.2);n.uniforms.uProbeStrength.value=k.strength*Ye,C.uniforms.uProg.value=t,G.uniforms.uOpacity.value=1-.6*p.smoothstep(t,.44,.5)*(1-p.smoothstep(t,.68,.74)),C.uniforms.uOpacity.value=.5+.5*p.smoothstep(t,.15,.4),G.uniforms.uProg.value=t},Ve=()=>{xe.set(B.x,B.y),ie.setFromCamera(xe,r);const t=ie.ray.origin,d=ie.ray.direction,w=Math.max(0,-t.dot(d));H.copy(t).addScaledVector(d,w),H.lengthSq()<1e-6&&H.set(0,0,1),H.normalize(),n.uniforms.uProbeDir.value.copy(H)},ye=()=>{const t=performance.now()/1e3,d=Math.min(J?t-J:0,.1);J=t,z+=d,k.x+=(B.x-k.x)*.12,k.y+=(B.y-k.y)*.12,k.strength+=(B.strength-k.strength)*.08,n.uniforms.uAmp.value=.085+.028*Math.sin(z*.62),n.uniforms.uTime.value=z,x.uniforms.uTime.value=z,D.uniforms.uTime.value=z,l.rotation.y=z*.05,b.rotation.y+=d*ge,C.uniforms.uTime.value=z,G.uniforms.uTime.value=z,X.uniforms.uTime.value=z,Ve(),Ne(),y.render(i,r)},we=()=>{if(!(!Q||Z)&&($=requestAnimationFrame(we),ye(),ne)){ee++;const t=performance.now();K||(K=t);const d=t-K;d>=2e3&&(ne(ee*1e3/d),ee=0,K=t)}};return{setProbe(t,d,w){B.x=t,B.y=d,B.strength=w},setProgress(t){he=p.clamp(t,0,1)},resize(t,d,w){y.setPixelRatio(w),y.setSize(t,d,!1),_=t<=640&&d>t,r.fov=_?48:38,r.aspect=t/d,r.updateProjectionMatrix()},start(){Q||Z||(Q=!0,J=0,ee=0,K=0,$=requestAnimationFrame(we))},stop(){Q=!1,cancelAnimationFrame($),$=0},renderOnce(){Z||ye()},onFps(t){ne=t},setQuality(t){if(t==="low"){if(ae=9,c.setDrawRange(0,Math.floor(a/2)),R.setDrawRange(0,Math.floor(j/2)),l.geometry===m){const d=new te(1.15,88,60);l.geometry=d,m.dispose()}}else ae=e==="high"?11:9,c.setDrawRange(0,a),R.setDrawRange(0,j)},dispose(){Z=!0,Q=!1,cancelAnimationFrame($),de.disconnect(),me.dispose(),C.dispose(),ve.dispose(),X.dispose(),R.dispose(),G.dispose(),l.geometry.dispose(),n.dispose(),c.dispose(),x.dispose(),M.dispose(),D.dispose(),O.dispose(),y.dispose();const t=y.getContext(),d=t&&t.getExtension("WEBGL_lose_context");d&&d.loseContext()}}}export{yt as createCellScene};
