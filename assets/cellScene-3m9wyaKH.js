import{W as ot,S as at,P as st,b as ie,a as H,F as nt,V as j,M as pe,d as De,e as k,p as Ge,A as de,g as Oe,I as it,q as rt,Q as lt,B as ct,m as ut,f as Re,r as mt,R as ft,s as d}from"./three.module-DRiFt6mT.js";function re(g){let e=g>>>0;return()=>{e|=0,e=e+1831565813|0;let y=Math.imul(e^e>>>15,1|e);return y=y+Math.imul(y^y>>>7,61|y)^y,((y^y>>>14)>>>0)/4294967296}}function t(g){return(g()+g()+g())/1.5-1}const ht=[5136383,3721471,3074264,3997550,11075374,14090030,16761134,16742972,16729431],We=`
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
`,Be=()=>({value:ht.map(g=>new Re(g))}),ke=`
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
`,pt=`
  uniform float uTime;
  uniform float uAmp;
  uniform vec3  uProbeDir;
  uniform float uProbeStrength;

  varying vec3 vNormalW;
  varying vec3 vPosW;
  varying float vDisp;

  ${ke}

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
`,dt=`
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
  attribute float aGeneA;
  attribute float aGeneB;

  uniform float uTime;
  uniform float uStageMix;
  uniform float uSize;
  uniform float uDrift;
  uniform float uWave;
  uniform float uSwim;

  varying float vSeed;
  varying float vTwinkle;
  varying float vWave;
  varying float vGene;
  varying vec3 vShapePos;

  void main() {
    vSeed = aSeed;
    vGene = mix(aGeneA, aGeneB, uStageMix);

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
    float geneGlow = smoothstep(0.12, 0.82, abs(vGene));
    float genePulse = 0.86 + 0.14 * sin(uTime * 2.4 + aSeed * 18.0);
    gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (1.0 + vWave * 0.4)
      * (1.0 + geneGlow * (0.42 + 0.22 * genePulse)) / max(0.5, -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`,gt=`
  uniform float uTime;
  uniform vec3 uBio;
  uniform vec3 uData;
  uniform vec3 uPal[9];
  uniform float uDataMix;
  uniform float uStageF;
  uniform float uOpacity;

  varying float vSeed;
  varying float vTwinkle;
  varying float vWave;
  varying float vGene;
  varying vec3 vShapePos;

  ${We}

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

    /* THE HERITABLE SIGNAL — the same highlighted particles move through
       chromosomes, gametes, fertilization, mtDNA and the edited DNA locus.
       Signed colour keeps maternal/bio and paternal/data material distinct
       without labels, cards or an additional overlay draw call. */
    float geneStrength = smoothstep(0.12, 0.82, abs(vGene));
    float genePulse = 0.9 + 0.1 * sin(uTime * 2.4 + vSeed * 18.0);
    vec3 geneCol = mix(uData, uBio, step(0.0, vGene));
    col = mix(col, geneCol * (1.18 + genePulse * 0.22), geneStrength * 0.92);

    col = mix(col, uData, uDataMix * 0.7);

    /* the wavefront brightens the lattice and flashes LIME at its crest:
       the biological signal running through the code — the thesis, lit */
    col *= 1.0 + vWave * 1.5;
    col = mix(col, uBio, smoothstep(0.72, 0.98, vWave));

    float geneAlpha = 1.0 + geneStrength * 0.38;
    gl_FragColor = vec4(col, soft * vTwinkle * uOpacity * (0.85 + vWave * 0.5) * geneAlpha);
  }
`,yt=`
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
`,xt=`
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
`;function wt(g){const e=re(20260810),y=[],b=[];{const c=new Float32Array(g*3);for(let h=0;h<g;h++)c[h*3]=t(e)*.42,c[h*3+1]=t(e)*.42,c[h*3+2]=t(e)*.42;y.push(c),b.push(new Float32Array(g))}{const c=new Float32Array(g*3),h=[];for(let p=0;p<26;p++)h.push([(e()*2-1)*2.4,(e()*2-1)*1.5,(e()*2-1)*.9]);for(let p=0;p<g;p++){const u=h[e()*h.length|0];c[p*3]=u[0]+t(e)*.16,c[p*3+1]=u[1]+t(e)*.16,c[p*3+2]=u[2]+t(e)*.16}y.push(c),b.push(new Float32Array(g))}{const c=new Float32Array(g*3),h=new Float32Array(g);for(let p=0;p<g;p++){const u=e();let i,l,r;if(u<.43){const a=t(e),s=t(e),m=t(e),n=Math.hypot(a,s,m)||1,f=1.05+(e()-.5)*.08;i=a/n*f,l=s/n*f,r=m/n*f}else if(u<.57){const a=t(e),s=t(e),m=t(e),n=Math.hypot(a,s,m)||1,f=.67+(e()-.5)*.045;i=a/n*f,l=s/n*f,r=m/n*f}else if(u<.68)i=t(e)*.42,l=t(e)*.42,r=t(e)*.24;else if(u<.81){const a=e()-.5;i=-.2+(e()<.5?-1:1)*a*.48+t(e)*.022,l=a*1.08+t(e)*.022,r=t(e)*.045,h[p]=-.82}else if(u<.91){if(e()<.54){const s=e();i=.23+(e()<.5?-1:1)*s*.22+t(e)*.02,l=.02+s*.43+t(e)*.02}else{const s=e();i=.23+t(e)*.022,l=.03-s*.5+t(e)*.02}r=t(e)*.045,h[p]=.82}else{const a=e()*Math.PI*2,s=.18+t(e)*.014;i=.57+Math.cos(a)*s,l=-.58+Math.sin(a)*s,r=t(e)*.035,h[p]=.58}c[p*3]=i,c[p*3+1]=l,c[p*3+2]=r}y.push(c),b.push(h)}{const c=new Float32Array(g*3),h=new Float32Array(g);for(let p=0;p<g;p++){const u=e();let i,l,r;if(u<.16)i=-1.5+t(e)*.3,l=t(e)*.22,r=t(e)*.13;else if(u<.23){const a=e()*Math.PI*2,s=2+(e()*3|0);i=-1.5+Math.cos(a*s)*.19+t(e)*.025,l=Math.sin(a*(s+1))*.12+t(e)*.02,r=Math.sin(a*2)*.055+t(e)*.018,h[p]=-.95}else if(u<.37){const a=e(),s=e()*Math.PI*2,m=.085+(e()-.5)*.02;i=-1.16+a*.61,l=Math.cos(s)*m,r=Math.sin(s)*m}else if(u<.95){const a=e();i=-.55+a*3.15;const s=.05*(1-a)+.008;l=.18*Math.sin((i+.55)*2.2)+t(e)*s,r=t(e)*s}else i=(e()-.5)*4.5,l=t(e)*.8,r=t(e)*.8;c[p*3]=i-.4,c[p*3+1]=l,c[p*3+2]=r}y.push(c),b.push(h)}{const c=new Float32Array(g*3),h=new Float32Array(g);for(let p=0;p<g;p++){const u=e();let i,l,r;if(u<.32){let a=t(e),s=t(e),m=t(e);const n=Math.hypot(a,s,m)||1,f=Math.cbrt(e())*1.16;i=a/n*f,l=s/n*f,r=m/n*f}else if(u<.5){let a=t(e),s=t(e),m=t(e);const n=Math.hypot(a,s,m)||1,f=1.32+(e()-.5)*.07;i=a/n*f,l=s/n*f,r=m/n*f}else if(u<.65){let a=t(e),s=t(e),m=t(e);const n=Math.hypot(a,s,m)||1,f=1.55+e()*.4;i=a/n*f+t(e)*.1,l=s/n*f+t(e)*.1,r=m/n*f+t(e)*.1}else if(u<.72){const a=e()*Math.PI*2,s=.22+.045*Math.sin(a*3);i=.3+Math.cos(a)*s+t(e)*.025,l=-.03+Math.sin(a)*s*.74+t(e)*.025,r=t(e)*.07,h[p]=.92}else if(u<.8)i=-1.48+t(e)*.18,l=.22+t(e)*.12,r=t(e)*.08;else if(u<.86){const a=e()*Math.PI*2;i=-.69+Math.cos(a*3)*.17+t(e)*.02,l=.18+Math.sin(a*4)*.12+t(e)*.02,r=Math.sin(a*2)*.05+t(e)*.018,h[p]=-.92}else{const a=e();i=-1.58-a*2.5;const s=.045*(1-a)+.008;l=.22+.3*Math.sin(a*5.2)*a+t(e)*s,r=t(e)*s}c[p*3]=i,c[p*3+1]=l,c[p*3+2]=r}y.push(c),b.push(h)}{const c=new Float32Array(g*3),h=(u,i,l,r,a)=>{const s=e();return[u+(l-u)*s+t(e)*a,i+(r-i)*s+t(e)*a,t(e)*a*1.6]},p=(u,i,l,r,a,s,m)=>{const n=e(),f=1-n;return[f*f*u+2*f*n*l+n*n*a+t(e)*m,f*f*i+2*f*n*r+n*n*s+t(e)*m,t(e)*m*1.6]};for(let u=0;u<g;u++){const i=e();let l,r,a;if(i<.13){const s=e()*Math.PI*2,m=.44+(e()-.5)*.05;l=-.18+Math.cos(s)*m,r=.62+Math.sin(s)*m*1.06,a=t(e)*.08}else if(i<.22)l=-.18+t(e)*.4,r=.62+t(e)*.42,a=t(e)*.3;else if(i<.25)[l,r,a]=h(-.6,.82,-.58,.36,.045),l-=Math.sin((r-.36)*3.2)*.07;else if(i<.4)[l,r,a]=p(.24,.94,.85,.12,.3,-.74,.08);else if(i<.52)l=.14+t(e)*.32,r=-.04+t(e)*.42,a=t(e)*.28;else if(i<.56)[l,r,a]=p(-.46,.28,-.5,-.2,-.02,-.52,.05);else if(i<.63)[l,r,a]=h(.26,-.56,-.26,-.4,.1);else if(i<.68)[l,r,a]=h(-.26,-.4,-.02,-.78,.075);else if(i<.71)l=.07+t(e)*.09,r=-.84+t(e)*.055,a=t(e)*.07;else if(i<.77)[l,r,a]=h(.1,.4,-.16,.1,.08);else if(i<.82)[l,r,a]=h(-.16,.1,-.48,.4,.065);else if(i<.85)l=-.53+t(e)*.075,r=.44+t(e)*.075,a=.04+t(e)*.06;else if(i<.96){let s=t(e),m=t(e),n=t(e);const f=Math.hypot(s,m,n)||1,w=1.5+(e()-.5)*.1;l=s/f*w*1.05,r=m/f*w*.95,a=n/f*w*.8}else l=t(e)*1.1,r=t(e)*1,a=t(e)*.7;c[u*3]=a*1.25,c[u*3+1]=r*1.25,c[u*3+2]=l*1.25}y.push(c),b.push(new Float32Array(g))}{const c=new Float32Array(g*3),h=new Float32Array(g),p=u=>.16*Math.sin(u*1.1);for(let u=0;u<g;u++){const i=e();let l,r,a;if(i<.28){let s=t(e),m=t(e),n=t(e);const f=Math.hypot(s,m,n)||1,w=.96+e()*.07;l=s/f*1.42*w,r=m/f*.6*w+p(l),a=n/f*.6*w}else if(i<.43){let s=t(e),m=t(e),n=t(e);const f=Math.hypot(s,m,n)||1;l=s/f*1.22,r=m/f*.5+p(l),a=n/f*.5}else if(i<.86){const m=-1.12+(e()*9|0)*.28,n=e()*Math.PI*2,f=Math.sqrt(e()),w=Math.cos(n)*f*.42,S=Math.sin(n)*f*.42;l=m+.09*Math.sin(w*9)+t(e)*.015,r=w+p(m),a=S}else if(i<.94){const s=e()*Math.PI*2;l=-.38+Math.cos(s)*.24+t(e)*.014,r=p(-.38)+Math.sin(s)*.17+t(e)*.014,a=t(e)*.025,h[u]=.88}else l=(e()-.5)*2.4,r=t(e)*.4+p(l),a=t(e)*.4;c[u*3]=a,c[u*3+1]=r,c[u*3+2]=l}y.push(c),b.push(h)}{const c=new Float32Array(g*3),h=new Float32Array(g),p=3,u=3.9,i=.62,l=30,r=2.1,a=19,s=[9,10],m=n=>(n/(l-1)-.5)*u;for(let n=0;n<g;n++){const f=e(),w=e(),S=(w-.5)*u,x=w*p*Math.PI*2;if(f<.33)c[n*3]=Math.cos(x)*i+t(e)*.016,c[n*3+1]=S,c[n*3+2]=Math.sin(x)*i+t(e)*.016,Math.abs(S-m(a))<.1&&(h[n]=-.58),Math.abs(S-m(s[0]))<.14&&(h[n]=.42);else if(f<.66)c[n*3]=Math.cos(x+r)*i+t(e)*.016,c[n*3+1]=S,c[n*3+2]=Math.sin(x+r)*i+t(e)*.016,Math.abs(S-m(a))<.1&&(h[n]=.58),Math.abs(S-m(s[1]))<.14&&(h[n]=.42);else{const C=e()*l|0,$=m(C),A=($/u+.5)*p*Math.PI*2,I=Math.floor(e()*44)/43,T=Math.cos(A)*i,J=Math.sin(A)*i,ee=Math.cos(A+r)*i,B=Math.sin(A+r)*i;c[n*3]=T+(ee-T)*I+t(e)*.006,c[n*3+1]=$+t(e)*.006,c[n*3+2]=J+(B-J)*I+t(e)*.006,C===a&&(h[n]=I<.5?-1:1),s.includes(C)&&(h[n]=.72)}}y.push(c),b.push(h)}{const c=new Float32Array(g*3),h=.55,p=Math.cos(h),u=Math.sin(h);for(let i=0;i<g;i++){const l=e();let r,a,s;if(l<.82){let m=t(e),n=t(e),f=t(e);const w=Math.hypot(m,n,f)||1;m/=w,n/=w,f/=w;const S=1+.075*Math.sin(6*n+4*m)*Math.cos(5*f+2*n)+.05*Math.sin(11*m+7*f),x=.93+e()*.09;r=m*.95*S*x,a=n*.6*S*x,s=f*.8*S*x,a<-.32&&(a=-.32-(Math.abs(a)-.32)*.35),a>.05&&Math.abs(r)<.1&&(r+=(r>=0?1:-1)*.09),r+=(r>=0?1:-1)*.03}else if(l<.95){let m=t(e),n=t(e),f=t(e);const w=Math.hypot(m,n,f)||1;m/=w,n/=w,f/=w;const S=1+.05*Math.sin(26*n),x=.9+e()*.12;r=m*.42*S*x,a=-.48+n*.24*S*x,s=-.5+f*.34*S*x}else{const m=e(),n=(1-m*.55)*.11,f=e()*Math.PI*2;r=Math.cos(f)*n,a=-.4-m*.45,s=-.16+m*.26+Math.sin(f)*n}c[i*3]=r*p+s*u,c[i*3+1]=a,c[i*3+2]=-r*u+s*p}y.push(c),b.push(new Float32Array(g))}return{positions:y,genes:b}}function Ee(){const g=getComputedStyle(document.documentElement),e=(y,b)=>{const c=g.getPropertyValue(y).trim();return new Re(c||b)};return{bio:e("--bio","#B6FF2E"),data:e("--data","#4FA8FF")}}const _e={high:5600,low:2400};function St(g,{quality:e="high"}={}){const y=new ot({canvas:g,alpha:!0,antialias:e==="high",powerPreference:"high-performance"});y.setClearColor(0,0);const b=new at,c=new st(38,1,.1,120);c.position.set(0,0,4.4);const h=Ee(),p=new ie(1.15,e==="high"?152:88,e==="high"?104:60),u=new H({uniforms:{uTime:{value:0},uAmp:{value:.1},uProbeDir:{value:new j(0,0,1)},uProbeStrength:{value:0},uBio:{value:h.bio.clone()},uData:{value:h.data.clone()},uOpacity:{value:1}},vertexShader:pt,fragmentShader:dt,transparent:!0,depthWrite:!1,side:nt}),i=new pe(p,u);i.renderOrder=3,b.add(i);const l=_e[e]||_e.high,{positions:r,genes:a}=wt(l),s=new De,m=new Float32Array(r[0]),n=new Float32Array(r[1]),f=new Float32Array(a[0]),w=new Float32Array(a[1]),S=new Float32Array(l);{const o=re(11);for(let v=0;v<l;v++)S[v]=o()}s.setAttribute("position",new k(r[0].slice(),3)),s.setAttribute("aPosA",new k(m,3)),s.setAttribute("aPosB",new k(n,3)),s.setAttribute("aGeneA",new k(f,1)),s.setAttribute("aGeneB",new k(w,1)),s.setAttribute("aSeed",new k(S,1)),s.boundingSphere=new Ge(new j(0,0,0),6);const x=new H({uniforms:{uTime:{value:0},uStageMix:{value:0},uSize:{value:e==="high"?11:9},uDrift:{value:1},uBio:{value:h.bio.clone()},uData:{value:h.data.clone()},uPal:Be(),uDataMix:{value:0},uStageF:{value:0},uWave:{value:0},uSwim:{value:0},uOpacity:{value:1}},vertexShader:vt,fragmentShader:gt,transparent:!0,depthWrite:!1,blending:de}),C=new Oe(s,x);C.renderOrder=2,b.add(C);const $=new ie(1,10,8),A=new H({uniforms:{uTime:{value:0},uBio:{value:h.bio.clone()},uData:{value:h.data.clone()},uOpacity:{value:1}},vertexShader:yt,fragmentShader:xt,transparent:!0,depthWrite:!1}),I=e==="high"?18:0,T=new it($,A,Math.max(1,I));T.count=I;{const o=re(7),v=new rt,M=new lt,P=new j,R=new j;for(let D=0;D<I;D++){let W=t(o),G=t(o),z=t(o);const O=Math.hypot(W,G,z)||1,V=.55+o()*.38;R.set(W/O*V,G/O*V,z/O*V);const q=.05+o()*.09;P.set(q,q*(.7+o()*.6),q),v.compose(R,M,P),T.setMatrixAt(D,v)}}T.renderOrder=1,b.add(T);const J=`
    uniform float uTime;
    uniform float uProg;
    uniform float uOpacity;
    uniform vec3 uBio;
    uniform vec3 uData;
    varying vec3 vDir;

    ${ke}

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
  `,ee=new ie(30,32,24),B=new H({uniforms:{uTime:{value:0},uProg:{value:0},uOpacity:{value:.5},uBio:{value:h.bio.clone()},uData:{value:h.data.clone()}},vertexShader:`
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:J,transparent:!0,depthWrite:!1,side:ct}),ve=new pe(ee,B);ve.renderOrder=-2,b.add(ve);const Ce=`
    varying vec2 vUv;
    void main() {
      /* billboard: anchor at the origin in view space, spread the quad */
      vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      mv.xy += position.xy * 8.5;
      vUv = position.xy;
      gl_Position = projectionMatrix * mv;
    }
  `,Ie=`
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
  `,ge=new ut(1,1),te=new H({uniforms:{uTime:{value:0},uFuse:{value:0}},vertexShader:Ce,fragmentShader:Ie,transparent:!0,depthWrite:!1,depthTest:!1,blending:de}),oe=new pe(ge,te);oe.renderOrder=4,oe.visible=!1,b.add(oe);const Le=`
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
  `,Ne=`
    uniform vec3 uBio;
    uniform vec3 uData;
    uniform vec3 uPal[9];
    uniform float uOpacity;
    varying float vSeed;
    varying float vGlow;

    ${We}

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
  `,Q=e==="high"?7e3:3e3,L=new De;{const o=new Float32Array(Q*3),v=new Float32Array(Q),M=re(990749);for(let P=0;P<Q;P++){let R=t(M),D=t(M),W=t(M);const G=Math.hypot(R,D,W)||1,z=7+17*Math.pow(M(),.65);o[P*3]=R/G*z,o[P*3+1]=D/G*z*.8,o[P*3+2]=W/G*z,v[P]=M()}L.setAttribute("position",new k(o,3)),L.setAttribute("aSeed",new k(v,1)),L.boundingSphere=new Ge(new j(0,0,0),40)}const U=new H({uniforms:{uTime:{value:0},uProg:{value:0},uSize:{value:e==="high"?26:22},uOpacity:{value:1},uBio:{value:h.bio.clone()},uData:{value:h.data.clone()},uPal:Be()},vertexShader:Le,fragmentShader:Ne,transparent:!0,depthWrite:!1,blending:de}),ye=new Oe(L,U);ye.renderOrder=0,b.add(ye);const Ue=()=>{const o=Ee();for(const v of[u,x,A,B,U])v.uniforms.uBio.value.copy(o.bio),v.uniforms.uData.value.copy(o.data)},xe=new MutationObserver(Ue);xe.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});let we=0,E=!1,le=e==="high"?11:9,be=.03,ce=[0,1];const _={x:0,y:0,strength:0},N={x:0,y:0,strength:0},ue=new ft,Se=new mt,Y=new j(0,0,1);let K=0,X=!1,ae=!1,se=0,F=0,me=null,ne=0,Z=0;const Ve=(o,v)=>{ce[0]===o&&ce[1]===v||(ce=[o,v],s.getAttribute("aPosA").array.set(r[o]),s.getAttribute("aPosB").array.set(r[v]),s.getAttribute("aGeneA").array.set(a[o]),s.getAttribute("aGeneB").array.set(a[v]),s.getAttribute("aPosA").needsUpdate=!0,s.getAttribute("aPosB").needsUpdate=!0,s.getAttribute("aGeneA").needsUpdate=!0,s.getAttribute("aGeneB").needsUpdate=!0)},qe=()=>{const o=we,v=8,M=Math.min(v-.001,o*v),P=Math.min(v-1,Math.floor(M));Ve(P,P+1);const R=M-P;x.uniforms.uStageMix.value=d.smoothstep(R,.12,.88),x.uniforms.uStageF.value=P+d.smoothstep(R,.12,.88),x.uniforms.uSwim.value=d.smoothstep(o,.3,.36)*(1-d.smoothstep(o,.46,.52));const D=d.smoothstep(o,.455,.485)*(1-d.smoothstep(o,.555,.615));te.uniforms.uFuse.value=D,oe.visible=D>.01;const W=d.smoothstep(o,.02,.24),G=d.smoothstep(o,.8,.86)*(1-d.smoothstep(o,.92,.97)),z=d.smoothstep(o,.3,.36)*(1-d.smoothstep(o,.44,.5)),O=d.smoothstep(o,.44,.5)*(1-d.smoothstep(o,.54,.6)),V=d.smoothstep(o,.56,.62)*(1-d.smoothstep(o,.66,.72)),q=d.smoothstep(o,.68,.73)*(1-d.smoothstep(o,.79,.84)),fe=d.clamp(1/c.aspect-1,0,1.4)/1.4,je=d.smoothstep(o,.9,.97),$e=fe*(.4*d.smoothstep(o,.24,.4)+1*z+1.5*O+.9*V+1.2*q+1.8*G+1.6*je),Qe=1-d.smoothstep(o,.08,.28),Ye=E?1.4*Qe:0,Ke=E?4.8*z:0,Xe=E?5.5*O:0,ze=4.4-3.1*W+1.2*d.smoothstep(o,.3,.9)+1.7*G+1.4*z+3.4*O+2.6*V+1.9*q+$e+Ye+Ke+Xe,he=.55*d.smoothstep(o,.16,.3)+.55*d.smoothstep(o,.3,.46)+.4*d.smoothstep(o,.5,.64)+.4*d.smoothstep(o,.66,.78)+2.2*d.smoothstep(o,.8,.92),Ze=E?-.34*O:0,Ae=-.52*(1-.6*fe)*d.smoothstep(o,.93,.985)*Math.cos(he)+Ze,Te=-.55*fe*d.smoothstep(o,.06,.2);if(c.position.x=Math.sin(he)*ze+Ae,c.position.z=Math.cos(he)*ze,c.position.y=Te+-.15*Math.sin(o*Math.PI)+.6*d.smoothstep(o,.3,.42)*(1-d.smoothstep(o,.52,.64)),c.lookAt(Ae,Te,0),E){const tt=1-.45*d.smoothstep(o,.08,.3);c.rotateZ(d.degToRad(-11)*tt)}u.uniforms.uOpacity.value=1-d.smoothstep(o,.08,.26),i.visible=u.uniforms.uOpacity.value>.01;const Je=1+W*2.2;i.scale.setScalar(Je),A.uniforms.uOpacity.value=u.uniforms.uOpacity.value,T.visible=i.visible,x.uniforms.uDataMix.value=d.smoothstep(o,.92,.99),x.uniforms.uDrift.value=1-.6*d.smoothstep(o,.93,.99),x.uniforms.uWave.value=d.smoothstep(o,.93,.99);const Fe=d.smoothstep(o,.8,.86)*(1-d.smoothstep(o,.9,.96));be=.03+.09*Fe,x.uniforms.uSize.value=le*(1+.6*d.smoothstep(o,.1,.5)+.35*Fe+.45*d.smoothstep(o,.93,1)+(E?.45*z+1*O:0));const et=1-d.smoothstep(o,.05,.2);u.uniforms.uProbeStrength.value=N.strength*et,B.uniforms.uProg.value=o,U.uniforms.uOpacity.value=1-.6*d.smoothstep(o,.44,.5)*(1-d.smoothstep(o,.68,.74)),B.uniforms.uOpacity.value=.5+.5*d.smoothstep(o,.15,.4),U.uniforms.uProg.value=o},He=()=>{Se.set(_.x,_.y),ue.setFromCamera(Se,c);const o=ue.ray.origin,v=ue.ray.direction,M=Math.max(0,-o.dot(v));Y.copy(o).addScaledVector(v,M),Y.lengthSq()<1e-6&&Y.set(0,0,1),Y.normalize(),u.uniforms.uProbeDir.value.copy(Y)},Me=()=>{const o=performance.now()/1e3,v=Math.min(se?o-se:0,.1);se=o,F+=v,N.x+=(_.x-N.x)*.12,N.y+=(_.y-N.y)*.12,N.strength+=(_.strength-N.strength)*.08,u.uniforms.uAmp.value=.085+.028*Math.sin(F*.62),u.uniforms.uTime.value=F,x.uniforms.uTime.value=F,A.uniforms.uTime.value=F,i.rotation.y=F*.05,C.rotation.y+=v*be,B.uniforms.uTime.value=F,U.uniforms.uTime.value=F,te.uniforms.uTime.value=F,He(),qe(),y.render(b,c)},Pe=()=>{if(!(!X||ae)&&(K=requestAnimationFrame(Pe),Me(),me)){ne++;const o=performance.now();Z||(Z=o);const v=o-Z;v>=2e3&&(me(ne*1e3/v),ne=0,Z=o)}};return{setProbe(o,v,M){_.x=o,_.y=v,_.strength=M},setProgress(o){we=d.clamp(o,0,1)},resize(o,v,M){y.setPixelRatio(M),y.setSize(o,v,!1),E=o<=640&&v>o,c.fov=E?48:38,c.aspect=o/v,c.updateProjectionMatrix()},start(){X||ae||(X=!0,se=0,ne=0,Z=0,K=requestAnimationFrame(Pe))},stop(){X=!1,cancelAnimationFrame(K),K=0},renderOnce(){ae||Me()},onFps(o){me=o},setQuality(o){if(o==="low"){if(le=9,s.setDrawRange(0,Math.floor(l/2)),L.setDrawRange(0,Math.floor(Q/2)),i.geometry===p){const v=new ie(1.15,88,60);i.geometry=v,p.dispose()}}else le=e==="high"?11:9,s.setDrawRange(0,l),L.setDrawRange(0,Q)},dispose(){ae=!0,X=!1,cancelAnimationFrame(K),xe.disconnect(),ee.dispose(),B.dispose(),ge.dispose(),te.dispose(),L.dispose(),U.dispose(),i.geometry.dispose(),u.dispose(),s.dispose(),x.dispose(),$.dispose(),A.dispose(),T.dispose(),y.dispose();const o=y.getContext(),v=o&&o.getExtension("WEBGL_lose_context");v&&v.loseContext()}}}export{St as createCellScene};
