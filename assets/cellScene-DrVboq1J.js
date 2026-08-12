import{W as Je,S as et,P as tt,b as te,a as N,F as ot,V,M as ce,d as ze,e as U,p as Te,A as ue,g as Fe,I as at,q as st,Q as nt,B as it,m as rt,f as _e,r as lt,R as ct,s as p}from"./three.module-DRiFt6mT.js";function oe(g){let e=g>>>0;return()=>{e|=0,e=e+1831565813|0;let x=Math.imul(e^e>>>15,1|e);return x=x+Math.imul(x^x>>>7,61|x)^x,((x^x>>>14)>>>0)/4294967296}}function t(g){return(g()+g()+g())/1.5-1}const ut=[5136383,3721471,3074264,3997550,11075374,14090030,16761134,16742972,16729431],Be=`
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
`;function gt(g){const e=oe(20260810),x=[];{const r=new Float32Array(g*3);for(let l=0;l<g;l++)r[l*3]=t(e)*.42,r[l*3+1]=t(e)*.42,r[l*3+2]=t(e)*.42;x.push(r)}{const r=new Float32Array(g*3),l=[];for(let v=0;v<26;v++)l.push([(e()*2-1)*2.4,(e()*2-1)*1.5,(e()*2-1)*.9]);for(let v=0;v<g;v++){const f=l[e()*l.length|0];r[v*3]=f[0]+t(e)*.16,r[v*3+1]=f[1]+t(e)*.16,r[v*3+2]=f[2]+t(e)*.16}x.push(r)}{const r=new Float32Array(g*3);for(let l=0;l<g;l++){const v=e();let f,n,i;if(v<.35){let a=t(e),s=t(e),u=t(e);const m=Math.hypot(a,s,u)||1,c=1.05+(e()-.5)*.08;r[l*3]=a/m*c,r[l*3+1]=s/m*c,r[l*3+2]=u/m*c;continue}else if(v<.47){let a=t(e),s=t(e),u=t(e);const m=Math.hypot(a,s,u)||1,c=.7+(e()-.5)*.045;f=a/m*c,n=s/m*c,i=u/m*c}else if(v<.68){const a=e()-.5;f=-.22+(e()<.5?-1:1)*a*.42+t(e)*.025,n=a*1.16+t(e)*.025,i=t(e)*.055}else if(v<.84){if(e()<.52){const s=e();f=.28+(e()<.5?-1:1)*s*.24+t(e)*.022,n=.02+s*.48+t(e)*.022}else{const s=e();f=.28+t(e)*.026,n=.04-s*.55+t(e)*.022}i=t(e)*.05}else if(v<.96){const a=e()*Math.PI*2,s=.2+t(e)*.018;f=.54+Math.cos(a)*s,n=-.58+Math.sin(a)*s,i=t(e)*.035}else{const a=e()<.55;f=(a?-.1:.37)+t(e)*.045,n=(a?.31:.22)+t(e)*.035,i=t(e)*.04}r[l*3]=f,r[l*3+1]=n,r[l*3+2]=i}x.push(r)}{const r=new Float32Array(g*3);for(let l=0;l<g;l++){const v=e();let f,n,i;if(v<.2)f=-1.5+t(e)*.3,n=t(e)*.22,i=t(e)*.13;else if(v<.34){const a=e(),s=e()*Math.PI*2,u=.085+(e()-.5)*.02;f=-1.16+a*.61,n=Math.cos(s)*u,i=Math.sin(s)*u}else if(v<.92){const a=e();f=-.55+a*3.15;const s=.05*(1-a)+.008;n=.18*Math.sin((f+.55)*2.2)+t(e)*s,i=t(e)*s}else f=(e()-.5)*4.5,n=t(e)*.8,i=t(e)*.8;r[l*3]=f-.4,r[l*3+1]=n,r[l*3+2]=i}x.push(r)}{const r=new Float32Array(g*3);for(let l=0;l<g;l++){const v=e();let f,n,i;if(v<.38){let a=t(e),s=t(e),u=t(e);const m=Math.hypot(a,s,u)||1,c=Math.cbrt(e())*1.16;f=a/m*c,n=s/m*c,i=u/m*c}else if(v<.56){let a=t(e),s=t(e),u=t(e);const m=Math.hypot(a,s,u)||1,c=1.32+(e()-.5)*.07;f=a/m*c,n=s/m*c,i=u/m*c}else if(v<.72){let a=t(e),s=t(e),u=t(e);const m=Math.hypot(a,s,u)||1,c=1.55+e()*.4;f=a/m*c+t(e)*.1,n=s/m*c+t(e)*.1,i=u/m*c+t(e)*.1}else if(v<.82)f=-1.48+t(e)*.18,n=.22+t(e)*.12,i=t(e)*.08;else{const a=e();f=-1.58-a*2.5;const s=.045*(1-a)+.008;n=.22+.3*Math.sin(a*5.2)*a+t(e)*s,i=t(e)*s}r[l*3]=f,r[l*3+1]=n,r[l*3+2]=i}x.push(r)}{const r=new Float32Array(g*3),l=(f,n,i,a,s)=>{const u=e();return[f+(i-f)*u+t(e)*s,n+(a-n)*u+t(e)*s,t(e)*s*1.6]},v=(f,n,i,a,s,u,m)=>{const c=e(),h=1-c;return[h*h*f+2*h*c*i+c*c*s+t(e)*m,h*h*n+2*h*c*a+c*c*u+t(e)*m,t(e)*m*1.6]};for(let f=0;f<g;f++){const n=e();let i,a,s;if(n<.13){const u=e()*Math.PI*2,m=.44+(e()-.5)*.05;i=-.18+Math.cos(u)*m,a=.62+Math.sin(u)*m*1.06,s=t(e)*.08}else if(n<.22)i=-.18+t(e)*.4,a=.62+t(e)*.42,s=t(e)*.3;else if(n<.25)[i,a,s]=l(-.6,.82,-.58,.36,.045),i-=Math.sin((a-.36)*3.2)*.07;else if(n<.4)[i,a,s]=v(.24,.94,.85,.12,.3,-.74,.08);else if(n<.52)i=.14+t(e)*.32,a=-.04+t(e)*.42,s=t(e)*.28;else if(n<.56)[i,a,s]=v(-.46,.28,-.5,-.2,-.02,-.52,.05);else if(n<.63)[i,a,s]=l(.26,-.56,-.26,-.4,.1);else if(n<.68)[i,a,s]=l(-.26,-.4,-.02,-.78,.075);else if(n<.71)i=.07+t(e)*.09,a=-.84+t(e)*.055,s=t(e)*.07;else if(n<.77)[i,a,s]=l(.1,.4,-.16,.1,.08);else if(n<.82)[i,a,s]=l(-.16,.1,-.48,.4,.065);else if(n<.85)i=-.53+t(e)*.075,a=.44+t(e)*.075,s=.04+t(e)*.06;else if(n<.96){let u=t(e),m=t(e),c=t(e);const h=Math.hypot(u,m,c)||1,y=1.5+(e()-.5)*.1;i=u/h*y*1.05,a=m/h*y*.95,s=c/h*y*.8}else i=t(e)*1.1,a=t(e)*1,s=t(e)*.7;r[f*3]=s*1.25,r[f*3+1]=a*1.25,r[f*3+2]=i*1.25}x.push(r)}{const r=new Float32Array(g*3),l=v=>.16*Math.sin(v*1.1);for(let v=0;v<g;v++){const f=e();let n,i,a;if(f<.3){let s=t(e),u=t(e),m=t(e);const c=Math.hypot(s,u,m)||1,h=.96+e()*.07;n=s/c*1.42*h,i=u/c*.6*h+l(n),a=m/c*.6*h}else if(f<.45){let s=t(e),u=t(e),m=t(e);const c=Math.hypot(s,u,m)||1;n=s/c*1.22,i=u/c*.5+l(n),a=m/c*.5}else if(f<.9){const u=-1.12+(e()*9|0)*.28,m=e()*Math.PI*2,c=Math.sqrt(e()),h=Math.cos(m)*c*.42,y=Math.sin(m)*c*.42;n=u+.09*Math.sin(h*9)+t(e)*.015,i=h+l(u),a=y}else n=(e()-.5)*2.4,i=t(e)*.4+l(n),a=t(e)*.4;r[v*3]=a,r[v*3+1]=i,r[v*3+2]=n}x.push(r)}{const r=new Float32Array(g*3),l=3,v=3.9,f=.62,n=30,i=2.1;for(let a=0;a<g;a++){const s=e(),u=e(),m=(u-.5)*v,c=u*l*Math.PI*2;if(s<.33)r[a*3]=Math.cos(c)*f+t(e)*.016,r[a*3+1]=m,r[a*3+2]=Math.sin(c)*f+t(e)*.016;else if(s<.66)r[a*3]=Math.cos(c+i)*f+t(e)*.016,r[a*3+1]=m,r[a*3+2]=Math.sin(c+i)*f+t(e)*.016;else{const h=((e()*n|0)/(n-1)-.5)*v,y=(h/v+.5)*l*Math.PI*2,b=Math.floor(e()*44)/43,M=Math.cos(y)*f,D=Math.sin(y)*f,q=Math.cos(y+i)*f,O=Math.sin(y+i)*f;r[a*3]=M+(q-M)*b+t(e)*.006,r[a*3+1]=h+t(e)*.006,r[a*3+2]=D+(O-D)*b+t(e)*.006}}x.push(r)}{const r=new Float32Array(g*3),l=.55,v=Math.cos(l),f=Math.sin(l);for(let n=0;n<g;n++){const i=e();let a,s,u;if(i<.82){let m=t(e),c=t(e),h=t(e);const y=Math.hypot(m,c,h)||1;m/=y,c/=y,h/=y;const b=1+.075*Math.sin(6*c+4*m)*Math.cos(5*h+2*c)+.05*Math.sin(11*m+7*h),M=.93+e()*.09;a=m*.95*b*M,s=c*.6*b*M,u=h*.8*b*M,s<-.32&&(s=-.32-(Math.abs(s)-.32)*.35),s>.05&&Math.abs(a)<.1&&(a+=(a>=0?1:-1)*.09),a+=(a>=0?1:-1)*.03}else if(i<.95){let m=t(e),c=t(e),h=t(e);const y=Math.hypot(m,c,h)||1;m/=y,c/=y,h/=y;const b=1+.05*Math.sin(26*c),M=.9+e()*.12;a=m*.42*b*M,s=-.48+c*.24*b*M,u=-.5+h*.34*b*M}else{const m=e(),c=(1-m*.55)*.11,h=e()*Math.PI*2;a=Math.cos(h)*c,s=-.4-m*.45,u=-.16+m*.26+Math.sin(h)*c}r[n*3]=a*v+u*f,r[n*3+1]=s,r[n*3+2]=-a*f+u*v}x.push(r)}return x}function De(){const g=getComputedStyle(document.documentElement),e=(x,r)=>{const l=g.getPropertyValue(x).trim();return new _e(l||r)};return{bio:e("--bio","#B6FF2E"),data:e("--data","#4FA8FF")}}const Oe={high:5600,low:2400};function xt(g,{quality:e="high"}={}){const x=new Je({canvas:g,alpha:!0,antialias:e==="high",powerPreference:"high-performance"});x.setClearColor(0,0);const r=new et,l=new tt(38,1,.1,120);l.position.set(0,0,4.4);const v=De(),f=new te(1.15,e==="high"?152:88,e==="high"?104:60),n=new N({uniforms:{uTime:{value:0},uAmp:{value:.1},uProbeDir:{value:new V(0,0,1)},uProbeStrength:{value:0},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uOpacity:{value:1}},vertexShader:mt,fragmentShader:ft,transparent:!0,depthWrite:!1,side:ot}),i=new ce(f,n);i.renderOrder=3,r.add(i);const a=Oe[e]||Oe.high,s=gt(a),u=new ze,m=new Float32Array(s[0]),c=new Float32Array(s[1]),h=new Float32Array(a);{const o=oe(11);for(let d=0;d<a;d++)h[d]=o()}u.setAttribute("position",new U(s[0].slice(),3)),u.setAttribute("aPosA",new U(m,3)),u.setAttribute("aPosB",new U(c,3)),u.setAttribute("aSeed",new U(h,1)),u.boundingSphere=new Te(new V(0,0,0),6);const y=new N({uniforms:{uTime:{value:0},uStageMix:{value:0},uSize:{value:e==="high"?11:9},uDrift:{value:1},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uPal:Ae(),uDataMix:{value:0},uStageF:{value:0},uWave:{value:0},uSwim:{value:0},uOpacity:{value:1}},vertexShader:vt,fragmentShader:pt,transparent:!0,depthWrite:!1,blending:ue}),b=new Fe(u,y);b.renderOrder=2,r.add(b);const M=new te(1,10,8),D=new N({uniforms:{uTime:{value:0},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uOpacity:{value:1}},vertexShader:dt,fragmentShader:ht,transparent:!0,depthWrite:!1}),q=e==="high"?18:0,O=new at(M,D,Math.max(1,q));O.count=q;{const o=oe(7),d=new st,w=new nt,S=new V,W=new V;for(let T=0;T<q;T++){let E=t(o),F=t(o),P=t(o);const A=Math.hypot(E,F,P)||1,L=.55+o()*.38;W.set(E/A*L,F/A*L,P/A*L);const I=.05+o()*.09;S.set(I,I*(.7+o()*.6),I),d.compose(W,w,S),O.setMatrixAt(T,d)}}O.renderOrder=1,r.add(O);const Ee=`
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
    `,fragmentShader:Ee,transparent:!0,depthWrite:!1,side:it}),fe=new ce(me,C);fe.renderOrder=-2,r.add(fe);const Re=`
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
  `,ve=new rt(1,1),K=new N({uniforms:{uTime:{value:0},uFuse:{value:0}},vertexShader:Re,fragmentShader:ke,transparent:!0,depthWrite:!1,depthTest:!1,blending:ue}),Y=new ce(ve,K);Y.renderOrder=4,Y.visible=!1,r.add(Y);const Ce=`
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
  `,j=e==="high"?7e3:3e3,R=new ze;{const o=new Float32Array(j*3),d=new Float32Array(j),w=oe(990749);for(let S=0;S<j;S++){let W=t(w),T=t(w),E=t(w);const F=Math.hypot(W,T,E)||1,P=7+17*Math.pow(w(),.65);o[S*3]=W/F*P,o[S*3+1]=T/F*P*.8,o[S*3+2]=E/F*P,d[S]=w()}R.setAttribute("position",new U(o,3)),R.setAttribute("aSeed",new U(d,1)),R.boundingSphere=new Te(new V(0,0,0),40)}const G=new N({uniforms:{uTime:{value:0},uProg:{value:0},uSize:{value:e==="high"?26:22},uOpacity:{value:1},uBio:{value:v.bio.clone()},uData:{value:v.data.clone()},uPal:Ae()},vertexShader:Ce,fragmentShader:Ge,transparent:!0,depthWrite:!1,blending:ue}),pe=new Fe(R,G);pe.renderOrder=0,r.add(pe);const Le=()=>{const o=De();for(const d of[n,y,D,C,G])d.uniforms.uBio.value.copy(o.bio),d.uniforms.uData.value.copy(o.data)},de=new MutationObserver(Le);de.observe(document.documentElement,{attributes:!0,attributeFilter:["class"]});let he=0,_=!1,ae=e==="high"?11:9,ge=.03,se=[0,1];const B={x:0,y:0,strength:0},k={x:0,y:0,strength:0},ne=new ct,ye=new lt,H=new V(0,0,1);let $=0,Q=!1,Z=!1,J=0,z=0,ie=null,ee=0,X=0;const Ie=(o,d)=>{se[0]===o&&se[1]===d||(se=[o,d],u.getAttribute("aPosA").array.set(s[o]),u.getAttribute("aPosB").array.set(s[d]),u.getAttribute("aPosA").needsUpdate=!0,u.getAttribute("aPosB").needsUpdate=!0)},Ne=()=>{const o=he,d=8,w=Math.min(d-.001,o*d),S=Math.min(d-1,Math.floor(w));Ie(S,S+1);const W=w-S;y.uniforms.uStageMix.value=p.smoothstep(W,.12,.88),y.uniforms.uStageF.value=S+p.smoothstep(W,.12,.88),y.uniforms.uSwim.value=p.smoothstep(o,.3,.36)*(1-p.smoothstep(o,.46,.52));const T=p.smoothstep(o,.455,.485)*(1-p.smoothstep(o,.555,.615));K.uniforms.uFuse.value=T,Y.visible=T>.01;const E=p.smoothstep(o,.02,.24),F=p.smoothstep(o,.8,.86)*(1-p.smoothstep(o,.92,.97)),P=p.smoothstep(o,.3,.36)*(1-p.smoothstep(o,.44,.5)),A=p.smoothstep(o,.44,.5)*(1-p.smoothstep(o,.54,.6)),L=p.smoothstep(o,.56,.62)*(1-p.smoothstep(o,.66,.72)),I=p.smoothstep(o,.68,.73)*(1-p.smoothstep(o,.79,.84)),re=p.clamp(1/l.aspect-1,0,1.4)/1.4,Ue=p.smoothstep(o,.9,.97),qe=re*(.4*p.smoothstep(o,.24,.4)+1*P+1.5*A+.9*L+1.2*I+1.8*F+1.6*Ue),je=1-p.smoothstep(o,.08,.28),He=_?1.4*je:0,$e=_?4.8*P:0,Qe=_?5.5*A:0,be=4.4-3.1*E+1.2*p.smoothstep(o,.3,.9)+1.7*F+1.4*P+3.4*A+2.6*L+1.9*I+qe+He+$e+Qe,le=.55*p.smoothstep(o,.16,.3)+.55*p.smoothstep(o,.3,.46)+.4*p.smoothstep(o,.5,.64)+.4*p.smoothstep(o,.66,.78)+2.2*p.smoothstep(o,.8,.92),Xe=_?-.34*A:0,Se=-.52*(1-.6*re)*p.smoothstep(o,.93,.985)*Math.cos(le)+Xe,Me=-.55*re*p.smoothstep(o,.06,.2);if(l.position.x=Math.sin(le)*be+Se,l.position.z=Math.cos(le)*be,l.position.y=Me+-.15*Math.sin(o*Math.PI)+.6*p.smoothstep(o,.3,.42)*(1-p.smoothstep(o,.52,.64)),l.lookAt(Se,Me,0),_){const Ze=1-.45*p.smoothstep(o,.08,.3);l.rotateZ(p.degToRad(-11)*Ze)}n.uniforms.uOpacity.value=1-p.smoothstep(o,.08,.26),i.visible=n.uniforms.uOpacity.value>.01;const Ke=1+E*2.2;i.scale.setScalar(Ke),D.uniforms.uOpacity.value=n.uniforms.uOpacity.value,O.visible=i.visible,y.uniforms.uDataMix.value=p.smoothstep(o,.92,.99),y.uniforms.uDrift.value=1-.6*p.smoothstep(o,.93,.99),y.uniforms.uWave.value=p.smoothstep(o,.93,.99);const Pe=p.smoothstep(o,.8,.86)*(1-p.smoothstep(o,.9,.96));ge=.03+.09*Pe,y.uniforms.uSize.value=ae*(1+.6*p.smoothstep(o,.1,.5)+.35*Pe+.45*p.smoothstep(o,.93,1)+(_?.45*P+1*A:0));const Ye=1-p.smoothstep(o,.05,.2);n.uniforms.uProbeStrength.value=k.strength*Ye,C.uniforms.uProg.value=o,G.uniforms.uOpacity.value=1-.6*p.smoothstep(o,.44,.5)*(1-p.smoothstep(o,.68,.74)),C.uniforms.uOpacity.value=.5+.5*p.smoothstep(o,.15,.4),G.uniforms.uProg.value=o},Ve=()=>{ye.set(B.x,B.y),ne.setFromCamera(ye,l);const o=ne.ray.origin,d=ne.ray.direction,w=Math.max(0,-o.dot(d));H.copy(o).addScaledVector(d,w),H.lengthSq()<1e-6&&H.set(0,0,1),H.normalize(),n.uniforms.uProbeDir.value.copy(H)},xe=()=>{const o=performance.now()/1e3,d=Math.min(J?o-J:0,.1);J=o,z+=d,k.x+=(B.x-k.x)*.12,k.y+=(B.y-k.y)*.12,k.strength+=(B.strength-k.strength)*.08,n.uniforms.uAmp.value=.085+.028*Math.sin(z*.62),n.uniforms.uTime.value=z,y.uniforms.uTime.value=z,D.uniforms.uTime.value=z,i.rotation.y=z*.05,b.rotation.y+=d*ge,C.uniforms.uTime.value=z,G.uniforms.uTime.value=z,K.uniforms.uTime.value=z,Ve(),Ne(),x.render(r,l)},we=()=>{if(!(!Q||Z)&&($=requestAnimationFrame(we),xe(),ie)){ee++;const o=performance.now();X||(X=o);const d=o-X;d>=2e3&&(ie(ee*1e3/d),ee=0,X=o)}};return{setProbe(o,d,w){B.x=o,B.y=d,B.strength=w},setProgress(o){he=p.clamp(o,0,1)},resize(o,d,w){x.setPixelRatio(w),x.setSize(o,d,!1),_=o<=640&&d>o,l.fov=_?48:38,l.aspect=o/d,l.updateProjectionMatrix()},start(){Q||Z||(Q=!0,J=0,ee=0,X=0,$=requestAnimationFrame(we))},stop(){Q=!1,cancelAnimationFrame($),$=0},renderOnce(){Z||xe()},onFps(o){ie=o},setQuality(o){if(o==="low"){if(ae=9,u.setDrawRange(0,Math.floor(a/2)),R.setDrawRange(0,Math.floor(j/2)),i.geometry===f){const d=new te(1.15,88,60);i.geometry=d,f.dispose()}}else ae=e==="high"?11:9,u.setDrawRange(0,a),R.setDrawRange(0,j)},dispose(){Z=!0,Q=!1,cancelAnimationFrame($),de.disconnect(),me.dispose(),C.dispose(),ve.dispose(),K.dispose(),R.dispose(),G.dispose(),i.geometry.dispose(),n.dispose(),u.dispose(),y.dispose(),M.dispose(),D.dispose(),O.dispose(),x.dispose();const o=x.getContext(),d=o&&o.getExtension("WEBGL_lose_context");d&&d.loseContext()}}}export{xt as createCellScene};
