import{W as Ve,S as Ue,P as qe,b as ee,a as k,F as je,V as G,M as re,d as Se,e as L,p as Me,A as le,g as Pe,I as He,q as $e,Q as Qe,B as Ke,m as Xe,f as Ae,r as Je,R as Ye,s as p}from"./three.module-DRiFt6mT.js";function te(g){let e=g>>>0;return()=>{e|=0,e=e+1831565813|0;let y=Math.imul(e^e>>>15,1|e);return y=y+Math.imul(y^y>>>7,61|y)^y,((y^y>>>14)>>>0)/4294967296}}function t(g){return(g()+g()+g())/1.5-1}const Ze=[5136383,3721471,3074264,3997550,11075374,14090030,16761134,16742972,16729431],De=`
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
`,ze=()=>({value:Ze.map(g=>new Ae(g))}),Oe=`
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
`,et=`
  uniform float uTime;
  uniform float uAmp;
  uniform vec3  uProbeDir;
  uniform float uProbeStrength;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vDisp;

  ${Oe}

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
`,tt=`
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
`,ot=`
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

    /* THE SIGNAL — diagonal brightness waves sweeping the code lattice */
    vWave = uWave * (0.5 + 0.5 * sin(uTime * 2.6 - (pos.x + pos.y * 0.8 + pos.z * 0.6) * 2.4));

    vTwinkle = 0.72 + 0.28 * sin(uTime * (1.2 + aSeed) + aSeed * 6.28);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (1.0 + vWave * 0.4) / max(0.5, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,at=`
  uniform vec3 uBio;
  uniform vec3 uData;
  uniform vec3 uPal[9];
  uniform float uDataMix;
  uniform float uStageF;
  uniform float uOpacity;

  varying float vSeed;
  varying float vTwinkle;
  varying float vWave;

  ${De}

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

    col = mix(col, uData, uDataMix * 0.7);

    /* the wavefront brightens the lattice and flashes LIME at its crest:
       the biological signal running through the code — the thesis, lit */
    col *= 1.0 + vWave * 1.5;
    col = mix(col, uBio, smoothstep(0.72, 0.98, vWave));

    gl_FragColor = vec4(col, soft * vTwinkle * uOpacity * (0.85 + vWave * 0.5));
  }
`,st=`
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
`,it=`
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
`;function nt(g){const e=te(20260810),y=[];{const i=new Float32Array(g*3);for(let l=0;l<g;l++)i[l*3]=t(e)*.42,i[l*3+1]=t(e)*.42,i[l*3+2]=t(e)*.42;y.push(i)}{const i=new Float32Array(g*3),l=[];for(let f=0;f<26;f++)l.push([(e()*2-1)*2.4,(e()*2-1)*1.5,(e()*2-1)*.9]);for(let f=0;f<g;f++){const c=l[e()*l.length|0];i[f*3]=c[0]+t(e)*.16,i[f*3+1]=c[1]+t(e)*.16,i[f*3+2]=c[2]+t(e)*.16}y.push(i)}{const i=new Float32Array(g*3);for(let l=0;l<g;l++)if(e()<.3)i[l*3]=t(e)*.22,i[l*3+1]=t(e)*.22,i[l*3+2]=t(e)*.22;else{let c=t(e),n=t(e),r=t(e);const a=Math.hypot(c,n,r)||1,s=1.05+(e()-.5)*.08;i[l*3]=c/a*s,i[l*3+1]=n/a*s,i[l*3+2]=r/a*s}y.push(i)}{const i=new Float32Array(g*3);for(let l=0;l<g;l++){const f=e();let c,n,r;if(f<.2)c=-1.5+t(e)*.3,n=t(e)*.22,r=t(e)*.13;else if(f<.34){const a=e(),s=e()*Math.PI*2,u=.085+(e()-.5)*.02;c=-1.16+a*.61,n=Math.cos(s)*u,r=Math.sin(s)*u}else if(f<.92){const a=e();c=-.55+a*3.15;const s=.05*(1-a)+.008;n=.18*Math.sin((c+.55)*2.2)+t(e)*s,r=t(e)*s}else c=(e()-.5)*4.5,n=t(e)*.8,r=t(e)*.8;i[l*3]=c-.4,i[l*3+1]=n,i[l*3+2]=r}y.push(i)}{const i=new Float32Array(g*3);for(let l=0;l<g;l++){const f=e();let c,n,r;if(f<.42)c=t(e)*.78,n=t(e)*.78,r=t(e)*.78;else if(f<.58){let a=t(e),s=t(e),u=t(e);const v=Math.hypot(a,s,u)||1,m=1.32+(e()-.5)*.07;c=a/v*m,n=s/v*m,r=u/v*m}else if(f<.76){let a=t(e),s=t(e),u=t(e);const v=Math.hypot(a,s,u)||1,m=1.55+e()*.4;c=a/v*m+t(e)*.1,n=s/v*m+t(e)*.1,r=u/v*m+t(e)*.1}else if(f<.82)c=-1.28+t(e)*.14,n=.22+t(e)*.1,r=t(e)*.08;else{const a=e();c=-1.4-a*2.3;const s=.045*(1-a)+.008;n=.22+.3*Math.sin(a*5.2)*a+t(e)*s,r=t(e)*s}i[l*3]=c,i[l*3+1]=n,i[l*3+2]=r}y.push(i)}{const i=new Float32Array(g*3),l=(c,n,r,a,s)=>{const u=e();return[c+(r-c)*u+t(e)*s,n+(a-n)*u+t(e)*s,t(e)*s*1.6]},f=(c,n,r,a,s,u,v)=>{const m=e(),h=1-m;return[h*h*c+2*h*m*r+m*m*s+t(e)*v,h*h*n+2*h*m*a+m*m*u+t(e)*v,t(e)*v*1.6]};for(let c=0;c<g;c++){const n=e();let r,a,s;if(n<.13){const u=e()*Math.PI*2,v=.44+(e()-.5)*.05;r=-.18+Math.cos(u)*v,a=.62+Math.sin(u)*v*1.06,s=t(e)*.08}else if(n<.22)r=-.18+t(e)*.4,a=.62+t(e)*.42,s=t(e)*.3;else if(n<.25)[r,a,s]=l(-.6,.82,-.58,.36,.045),r-=Math.sin((a-.36)*3.2)*.07;else if(n<.4)[r,a,s]=f(.24,.94,.85,.12,.3,-.74,.08);else if(n<.52)r=.14+t(e)*.32,a=-.04+t(e)*.42,s=t(e)*.28;else if(n<.56)[r,a,s]=f(-.46,.28,-.5,-.2,-.02,-.52,.05);else if(n<.63)[r,a,s]=l(.26,-.56,-.26,-.4,.1);else if(n<.68)[r,a,s]=l(-.26,-.4,-.02,-.78,.075);else if(n<.71)r=.07+t(e)*.09,a=-.84+t(e)*.055,s=t(e)*.07;else if(n<.77)[r,a,s]=l(.1,.4,-.16,.1,.08);else if(n<.82)[r,a,s]=l(-.16,.1,-.48,.4,.065);else if(n<.85)r=-.53+t(e)*.075,a=.44+t(e)*.075,s=.04+t(e)*.06;else if(n<.96){let u=t(e),v=t(e),m=t(e);const h=Math.hypot(u,v,m)||1,x=1.5+(e()-.5)*.1;r=u/h*x*1.05,a=v/h*x*.95,s=m/h*x*.8}else r=t(e)*1.1,a=t(e)*1,s=t(e)*.7;i[c*3]=s*1.25,i[c*3+1]=a*1.25,i[c*3+2]=r*1.25}y.push(i)}{const i=new Float32Array(g*3),l=f=>.16*Math.sin(f*1.1);for(let f=0;f<g;f++){const c=e();let n,r,a;if(c<.3){let s=t(e),u=t(e),v=t(e);const m=Math.hypot(s,u,v)||1,h=.96+e()*.07;n=s/m*1.42*h,r=u/m*.6*h+l(n),a=v/m*.6*h}else if(c<.45){let s=t(e),u=t(e),v=t(e);const m=Math.hypot(s,u,v)||1;n=s/m*1.22,r=u/m*.5+l(n),a=v/m*.5}else if(c<.9){const u=-1.12+(e()*9|0)*.28,v=e()*Math.PI*2,m=Math.sqrt(e()),h=Math.cos(v)*m*.42,x=Math.sin(v)*m*.42;n=u+.09*Math.sin(h*9)+t(e)*.015,r=h+l(u),a=x}else n=(e()-.5)*2.4,r=t(e)*.4+l(n),a=t(e)*.4;i[f*3]=a,i[f*3+1]=r,i[f*3+2]=n}y.push(i)}{const i=new Float32Array(g*3),l=3,f=3.9,c=.62,n=30,r=2.1;for(let a=0;a<g;a++){const s=e(),u=e(),v=(u-.5)*f,m=u*l*Math.PI*2;if(s<.33)i[a*3]=Math.cos(m)*c+t(e)*.016,i[a*3+1]=v,i[a*3+2]=Math.sin(m)*c+t(e)*.016;else if(s<.66)i[a*3]=Math.cos(m+r)*c+t(e)*.016,i[a*3+1]=v,i[a*3+2]=Math.sin(m+r)*c+t(e)*.016;else{const h=((e()*n|0)/(n-1)-.5)*f,x=(h/f+.5)*l*Math.PI*2,b=Math.floor(e()*44)/43,M=Math.cos(x)*c,T=Math.sin(x)*c,N=Math.cos(x+r)*c,F=Math.sin(x+r)*c;i[a*3]=M+(N-M)*b+t(e)*.006,i[a*3+1]=h+t(e)*.006,i[a*3+2]=T+(F-T)*b+t(e)*.006}}y.push(i)}{const i=new Float32Array(g*3),l=.55,f=Math.cos(l),c=Math.sin(l);for(let n=0;n<g;n++){const r=e();let a,s,u;if(r<.82){let v=t(e),m=t(e),h=t(e);const x=Math.hypot(v,m,h)||1;v/=x,m/=x,h/=x;const b=1+.075*Math.sin(6*m+4*v)*Math.cos(5*h+2*m)+.05*Math.sin(11*v+7*h),M=.93+e()*.09;a=v*.95*b*M,s=m*.6*b*M,u=h*.8*b*M,s<-.32&&(s=-.32-(Math.abs(s)-.32)*.35),s>.05&&Math.abs(a)<.1&&(a+=(a>=0?1:-1)*.09),a+=(a>=0?1:-1)*.03}else if(r<.95){let v=t(e),m=t(e),h=t(e);const x=Math.hypot(v,m,h)||1;v/=x,m/=x,h/=x;const b=1+.05*Math.sin(26*m),M=.9+e()*.12;a=v*.42*b*M,s=-.48+m*.24*b*M,u=-.5+h*.34*b*M}else{const v=e(),m=(1-v*.55)*.11,h=e()*Math.PI*2;a=Math.cos(h)*m,s=-.4-v*.45,u=-.16+v*.26+Math.sin(h)*m}i[n*3]=a*f+u*c,i[n*3+1]=s,i[n*3+2]=-a*c+u*f}y.push(i)}return y}function Te(){const g=getComputedStyle(document.documentElement),e=(y,i)=>{const l=g.getPropertyValue(y).trim();return new Ae(l||i)};return{bio:e("--bio","#B6FF2E"),data:e("--data","#4FA8FF")}}const Fe={high:4200,low:2e3};function lt(g,{quality:e="high"}={}){const y=new Ve({canvas:g,alpha:!0,antialias:e==="high",powerPreference:"high-performance"});y.setClearColor(0,0);const i=new Ue,l=new qe(38,1,.1,120);l.position.set(0,0,4.4);const f=Te(),c=new ee(1.15,e==="high"?152:88,e==="high"?104:60),n=new k({uniforms:{uTime:{value:0},uAmp:{value:.1},uProbeDir:{value:new G(0,0,1)},uProbeStrength:{value:0},uBio:{value:f.bio.clone()},uData:{value:f.data.clone()},uOpacity:{value:1}},vertexShader:et,fragmentShader:tt,transparent:!0,depthWrite:!1,side:je}),r=new re(c,n);r.renderOrder=3,i.add(r);const a=Fe[e]||Fe.high,s=nt(a),u=new Se,v=new Float32Array(s[0]),m=new Float32Array(s[1]),h=new Float32Array(a);{const o=te(11);for(let d=0;d<a;d++)h[d]=o()}u.setAttribute("position",new L(s[0].slice(),3)),u.setAttribute("aPosA",new L(v,3)),u.setAttribute("aPosB",new L(m,3)),u.setAttribute("aSeed",new L(h,1)),u.boundingSphere=new Me(new G(0,0,0),6);const x=new k({uniforms:{uTime:{value:0},uStageMix:{value:0},uSize:{value:e==="high"?11:9},uDrift:{value:1},uBio:{value:f.bio.clone()},uData:{value:f.data.clone()},uPal:ze(),uDataMix:{value:0},uStageF:{value:0},uWave:{value:0},uSwim:{value:0},uOpacity:{value:1}},vertexShader:ot,fragmentShader:at,transparent:!0,depthWrite:!1,blending:le}),b=new Pe(u,x);b.renderOrder=2,i.add(b);const M=new ee(1,10,8),T=new k({uniforms:{uTime:{value:0},uBio:{value:f.bio.clone()},uData:{value:f.data.clone()},uOpacity:{value:1}},vertexShader:st,fragmentShader:it,transparent:!0,depthWrite:!1}),N=e==="high"?18:0,F=new He(M,T,Math.max(1,N));F.count=N;{const o=te(7),d=new $e,w=new Qe,S=new G,D=new G;for(let z=0;z<N;z++){let O=t(o),_=t(o),B=t(o);const H=Math.hypot(O,_,B)||1,$=.55+o()*.38;D.set(O/H*$,_/H*$,B/H*$);const Q=.05+o()*.09;S.set(Q,Q*(.7+o()*.6),Q),d.compose(D,w,S),F.setMatrixAt(z,d)}}F.renderOrder=1,i.add(F);const _e=`
    uniform float uTime;
    uniform float uProg;
    uniform float uOpacity;
    uniform vec3 uBio;
    uniform vec3 uData;
    varying vec3 vDir;

    ${Oe}

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
  `,ce=new ee(30,32,24),R=new k({uniforms:{uTime:{value:0},uProg:{value:0},uOpacity:{value:.5},uBio:{value:f.bio.clone()},uData:{value:f.data.clone()}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:_e,transparent:!0,depthWrite:!1,side:Ke}),ue=new re(ce,R);ue.renderOrder=-2,i.add(ue);const Be=`
    varying vec2 vUv;
    void main() {
      /* billboard: anchor at the origin in view space, spread the quad */
      vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      mv.xy += position.xy * 8.5;
      vUv = position.xy;
      gl_Position = projectionMatrix * mv;
    }
  `,We=`
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

      vec3 gold = vec3(1.0, 0.78, 0.38);
      vec3 spark = vec3(1.0, 0.96, 0.88);
      vec3 col = gold * core * 0.9 + spark * (ring1 + ring2) * 0.85;
      float a = (core * 0.55 + (ring1 + ring2) * 0.5) * uFuse;
      gl_FragColor = vec4(col, a);
    }
  `,me=new Xe(1,1),K=new k({uniforms:{uTime:{value:0},uFuse:{value:0}},vertexShader:Be,fragmentShader:We,transparent:!0,depthWrite:!1,depthTest:!1,blending:le}),X=new re(me,K);X.renderOrder=4,X.visible=!1,i.add(X);const Ee=`
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
  `,Re=`
    uniform vec3 uBio;
    uniform vec3 uData;
    uniform vec3 uPal[9];
    uniform float uOpacity;
    varying float vSeed;
    varying float vGlow;

    ${De}

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
  `,I=e==="high"?7e3:3e3,W=new Se;{const o=new Float32Array(I*3),d=new Float32Array(I),w=te(990749);for(let S=0;S<I;S++){let D=t(w),z=t(w),O=t(w);const _=Math.hypot(D,z,O)||1,B=7+17*Math.pow(w(),.65);o[S*3]=D/_*B,o[S*3+1]=z/_*B*.8,o[S*3+2]=O/_*B,d[S]=w()}W.setAttribute("position",new L(o,3)),W.setAttribute("aSeed",new L(d,1)),W.boundingSphere=new Me(new G(0,0,0),40)}const C=new k({uniforms:{uTime:{value:0},uProg:{value:0},uSize:{value:e==="high"?26:22},uOpacity:{value:1},uBio:{value:f.bio.clone()},uData:{value:f.data.clone()},uPal:ze()},vertexShader:Ee,fragmentShader:Re,transparent:!0,depthWrite:!1,blending:le}),fe=new Pe(W,C);fe.renderOrder=0,i.add(fe);const Ce=()=>{const o=Te();for(const d of[n,x,T,R,C])d.uniforms.uBio.value.copy(o.bio),d.uniforms.uData.value.copy(o.data)},ve=new MutationObserver(Ce);ve.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});let de=0,oe=e==="high"?11:9,pe=.03,ae=[0,1];const A={x:0,y:0,strength:0},E={x:0,y:0,strength:0},se=new Ye,he=new Je,V=new G(0,0,1);let U=0,q=!1,J=!1,Y=0,P=0,ie=null,Z=0,j=0;const ke=(o,d)=>{ae[0]===o&&ae[1]===d||(ae=[o,d],u.getAttribute("aPosA").array.set(s[o]),u.getAttribute("aPosB").array.set(s[d]),u.getAttribute("aPosA").needsUpdate=!0,u.getAttribute("aPosB").needsUpdate=!0)},Ge=()=>{const o=de,d=8,w=Math.min(d-.001,o*d),S=Math.min(d-1,Math.floor(w));ke(S,S+1);const D=w-S;x.uniforms.uStageMix.value=p.smoothstep(D,.12,.88),x.uniforms.uStageF.value=S+p.smoothstep(D,.12,.88),x.uniforms.uSwim.value=p.smoothstep(o,.3,.36)*(1-p.smoothstep(o,.46,.52));const z=p.smoothstep(o,.455,.485)*(1-p.smoothstep(o,.555,.615));K.uniforms.uFuse.value=z,X.visible=z>.01;const O=p.smoothstep(o,.02,.24),_=p.smoothstep(o,.8,.86)*(1-p.smoothstep(o,.92,.97)),B=p.smoothstep(o,.3,.36)*(1-p.smoothstep(o,.44,.5)),H=p.smoothstep(o,.44,.5)*(1-p.smoothstep(o,.54,.6)),$=p.smoothstep(o,.56,.62)*(1-p.smoothstep(o,.66,.72)),Q=p.smoothstep(o,.68,.73)*(1-p.smoothstep(o,.79,.84)),ye=4.4-3.1*O+1.2*p.smoothstep(o,.3,.9)+1.7*_+1.4*B+3.4*H+2.6*$+1.9*Q,ne=.55*p.smoothstep(o,.16,.3)+.55*p.smoothstep(o,.3,.46)+.4*p.smoothstep(o,.5,.64)+.4*p.smoothstep(o,.66,.78)+2.2*p.smoothstep(o,.8,.92),we=-.52*p.smoothstep(o,.93,.985)*Math.cos(ne);l.position.x=Math.sin(ne)*ye+we,l.position.z=Math.cos(ne)*ye,l.position.y=-.15*Math.sin(o*Math.PI)+.6*p.smoothstep(o,.3,.42)*(1-p.smoothstep(o,.52,.64)),l.lookAt(we,0,0),n.uniforms.uOpacity.value=1-p.smoothstep(o,.08,.26),r.visible=n.uniforms.uOpacity.value>.01;const Ne=1+O*2.2;r.scale.setScalar(Ne),T.uniforms.uOpacity.value=n.uniforms.uOpacity.value,F.visible=r.visible,x.uniforms.uDataMix.value=p.smoothstep(o,.92,.99),x.uniforms.uDrift.value=1-.6*p.smoothstep(o,.93,.99),x.uniforms.uWave.value=p.smoothstep(o,.93,.99);const be=p.smoothstep(o,.8,.86)*(1-p.smoothstep(o,.9,.96));pe=.03+.09*be,x.uniforms.uSize.value=oe*(1+.6*p.smoothstep(o,.1,.5)+.35*be+.45*p.smoothstep(o,.93,1));const Ie=1-p.smoothstep(o,.05,.2);n.uniforms.uProbeStrength.value=E.strength*Ie,R.uniforms.uProg.value=o,C.uniforms.uOpacity.value=1-.6*p.smoothstep(o,.44,.5)*(1-p.smoothstep(o,.68,.74)),R.uniforms.uOpacity.value=.5+.5*p.smoothstep(o,.15,.4),C.uniforms.uProg.value=o},Le=()=>{he.set(A.x,A.y),se.setFromCamera(he,l);const o=se.ray.origin,d=se.ray.direction,w=Math.max(0,-o.dot(d));V.copy(o).addScaledVector(d,w),V.lengthSq()<1e-6&&V.set(0,0,1),V.normalize(),n.uniforms.uProbeDir.value.copy(V)},ge=()=>{const o=performance.now()/1e3,d=Math.min(Y?o-Y:0,.1);Y=o,P+=d,E.x+=(A.x-E.x)*.12,E.y+=(A.y-E.y)*.12,E.strength+=(A.strength-E.strength)*.08,n.uniforms.uAmp.value=.085+.028*Math.sin(P*.62),n.uniforms.uTime.value=P,x.uniforms.uTime.value=P,T.uniforms.uTime.value=P,r.rotation.y=P*.05,b.rotation.y+=d*pe,R.uniforms.uTime.value=P,C.uniforms.uTime.value=P,K.uniforms.uTime.value=P,Le(),Ge(),y.render(i,l)},xe=()=>{if(!(!q||J)&&(U=requestAnimationFrame(xe),ge(),ie)){Z++;const o=performance.now();j||(j=o);const d=o-j;d>=2e3&&(ie(Z*1e3/d),Z=0,j=o)}};return{setProbe(o,d,w){A.x=o,A.y=d,A.strength=w},setProgress(o){de=p.clamp(o,0,1)},resize(o,d,w){y.setPixelRatio(w),y.setSize(o,d,!1),l.aspect=o/d,l.updateProjectionMatrix()},start(){q||J||(q=!0,Y=0,Z=0,j=0,U=requestAnimationFrame(xe))},stop(){q=!1,cancelAnimationFrame(U),U=0},renderOnce(){J||ge()},onFps(o){ie=o},setQuality(o){if(o==="low"){if(oe=9,u.setDrawRange(0,Math.floor(a/2)),W.setDrawRange(0,Math.floor(I/2)),r.geometry===c){const d=new ee(1.15,88,60);r.geometry=d,c.dispose()}}else oe=e==="high"?11:9,u.setDrawRange(0,a),W.setDrawRange(0,I)},dispose(){J=!0,q=!1,cancelAnimationFrame(U),ve.disconnect(),ce.dispose(),R.dispose(),me.dispose(),K.dispose(),W.dispose(),C.dispose(),r.geometry.dispose(),n.dispose(),u.dispose(),x.dispose(),M.dispose(),T.dispose(),F.dispose(),y.dispose();const o=y.getContext(),d=o&&o.getExtension("WEBGL_lose_context");d&&d.loseContext()}}}export{lt as createCellScene};
