/* BFS218 Visual Worlds v5 - distinct, grounded teaching models.
   Self-contained scene library. app.js passes THREE plus a context and
   receives { tick, dispose, skipDefaultStage }. Every scene is procedural
   Three.js: no external assets, no network calls, palette matches the site
   (ink 1B2A4A, teal 00AEB3, orange FFA12B, seneca red DA291C). */
(function () {
  'use strict';

  var PAL = {
    ink: 0x1b2a4a, inkSoft: 0x33456b, teal: 0x00aeb3, tealSoft: 0x9fdde0,
    orange: 0xffa12b, amber: 0xffcc66, red: 0xda291c, redSoft: 0xfbe9ea,
    green: 0x1c7a43, greenSoft: 0xe7f3ec, bone: 0xf4f1ea, white: 0xffffff,
    steel: 0xb9c4cf, floor: 0xe9eef2, line: 0x8ba0b4
  };

  /* One quality bar, several visual languages. The week chooses the style. */
  var STYLE_KINDS = {
    technical: ['pipeline', 'switches', 'audit', 'gate', 'sorting', 'mechanismatch', 'decisionpath', 'defaultboard', 'surveillanceflow', 'detector', 'thresholdaudit'],
    civic: ['outcomelens', 'benevolence', 'promisefunnel', 'policy', 'policydeck'],
    cartographic: ['map', 'vault', 'datastory', 'return', 'capstonemap', 'compass', 'futurecompass'],
    workshop: ['review', 'repair', 'startermap', 'matchwork', 'toolkit', 'repairtable']
  };
  function styleFor(kind) {
    var names = Object.keys(STYLE_KINDS);
    for (var i = 0; i < names.length; i++) if (STYLE_KINDS[names[i]].indexOf(kind) >= 0) return names[i];
    return 'diorama';
  }

  /* ------------------------------------------------------------------ kit */
  function makeKit(THREE, ctx) {
    var K = { THREE: THREE, ctx: ctx, ticks: [], disposables: [], textures: [] };
    var root = ctx.root;

    K.onTick = function (fn) { K.ticks.push(fn); };
    K.own = function (obj) { K.disposables.push(obj); return obj; };

    /* --- environment reflections (hand-rolled room, PMREM) --- */
    K.environment = function () {
      try {
        var style = ctx.style || styleFor(ctx.kind);
        var rooms = {
          technical: { wall: 0xd7dcde, key: 0xfff7eb, fill: 0xd8e5ec, edge: 0xd8c6ad, bounce: 0xc7d2d5 },
          civic: { wall: 0xd8d4cd, key: 0xfff1dc, fill: 0xd8e2ea, edge: 0xd8bfa3, bounce: 0xc8d2d0 },
          cartographic: { wall: 0xd5d0c5, key: 0xffefd2, fill: 0xd2e0e4, edge: 0xcbb28f, bounce: 0xbfcac8 },
          workshop: { wall: 0xd4d0c8, key: 0xffe8c8, fill: 0xd4e0e5, edge: 0xd0ad83, bounce: 0xc3cecc },
          diorama: { wall: 0xd6dce1, key: 0xfff8ef, fill: 0xdce8f2, edge: 0xe8cfae, bounce: 0xc6d8da }
        };
        var room = rooms[style] || rooms.diorama;
        var pm = new THREE.PMREMGenerator(ctx.renderer);
        var env = new THREE.Scene();
        var geo = new THREE.BoxGeometry(10, 10, 10);
        var wall = new THREE.MeshBasicMaterial({ color: room.wall, side: THREE.BackSide });
        env.add(new THREE.Mesh(geo, wall));
        function panel(w, h, c, i, pos, rot) {
          var p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c }));
          p.material.color.multiplyScalar(i);
          p.position.set(pos[0], pos[1], pos[2]);
          if (rot) p.rotation.set(rot[0], rot[1], rot[2]);
          env.add(p);
        }
        panel(4, 2.6, room.key, 1.65, [0, 4.2, -3.4], [0.5, 0, 0]);
        panel(3, 2.2, room.fill, 0.9, [-3.8, 2.6, 1.6], [0, 1.05, 0]);
        panel(2.4, 1.6, room.edge, 0.72, [3.9, 1.9, 1.2], [0, -1.0, 0]);
        panel(2.2, 1.4, room.bounce, 0.5, [0.4, 1.4, 4.4], [0, Math.PI, 0]);
        var rt = pm.fromScene(env, 0.04);
        ctx.scene.environment = rt.texture;
        K.disposables.push({ dispose: function () { rt.dispose(); pm.dispose(); } });
        geo.dispose(); wall.dispose();
      } catch (e) { /* environment is an enhancement, never a blocker */ }
    };

    /* --- soft shadows (lighter on phones) --- */
    K.shadows = function (sun) {
      try {
        var small = false;
        try { small = window.matchMedia && window.matchMedia('(max-width: 760px)').matches; } catch (e2) {}
        if (small) ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        ctx.renderer.shadowMap.enabled = true;
        ctx.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sun.castShadow = true;
        sun.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
        sun.shadow.camera.near = 1; sun.shadow.camera.far = 20;
        sun.shadow.camera.left = -5; sun.shadow.camera.right = 5;
        sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -3;
        sun.shadow.bias = -0.0006;
        sun.shadow.radius = 4;
      } catch (e) {}
    };

    /* --- materials --- */
    K.mat = {};
    K.mat.plastic = function (c, rough) { return K.own(new THREE.MeshPhysicalMaterial({ color: c, roughness: rough == null ? 0.72 : rough, metalness: 0.01, clearcoat: 0.08, clearcoatRoughness: 0.72 })); };
    K.mat.metal = function (c, rough) { return K.own(new THREE.MeshPhysicalMaterial({ color: c == null ? PAL.steel : c, roughness: rough == null ? 0.5 : rough, metalness: 0.62, clearcoat: 0.06, clearcoatRoughness: 0.62 })); };
    K.mat.ink = function () { return K.mat.plastic(PAL.ink, 0.58); };
    K.mat.glass = function (c, opacity) {
      return K.own(new THREE.MeshPhysicalMaterial({
        color: c == null ? PAL.tealSoft : c, transparent: true, opacity: opacity == null ? 0.34 : opacity,
        roughness: 0.16, metalness: 0.01, transmission: 0.34, thickness: 0.28,
        clearcoat: 0.5, clearcoatRoughness: 0.18, ior: 1.45, side: THREE.DoubleSide
      }));
    };
    K.mat.neon = function (c, intensity) {
      return K.own(new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: intensity == null ? 0.18 : Math.min(0.38, intensity * 0.24), roughness: 0.58, metalness: 0.04 }));
    };
    K.mat.holo = function (c, opacity) {
      var mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(c == null ? PAL.teal : c) },
          uTime: { value: 0 },
          uOpacity: { value: opacity == null ? 0.55 : opacity }
        },
        vertexShader: [
          'varying vec3 vN; varying vec3 vV; varying vec2 vUv;',
          'void main(){ vUv=uv; vN=normalize(normalMatrix*normal);',
          ' vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz);',
          ' gl_Position=projectionMatrix*mv; }'
        ].join('\n'),
        fragmentShader: [
          'uniform vec3 uColor; uniform float uTime; uniform float uOpacity;',
          'varying vec3 vN; varying vec3 vV; varying vec2 vUv;',
          'void main(){',
          ' float fres=pow(1.0-abs(dot(normalize(vN),normalize(vV))),2.0);',
          ' float scan=0.5+0.5*sin(vUv.y*72.0+uTime*1.8);',
          ' float band=smoothstep(0.985,1.0,fract(vUv.y*1.0-uTime*0.06));',
          ' float a=uOpacity*(0.28+0.42*fres+0.08*scan+0.24*band);',
          ' gl_FragColor=vec4(uColor*(0.78+0.35*fres),a); }'
        ].join('\n')
      });
      K.own(mat);
      K.onTick(function (t) { mat.uniforms.uTime.value = t; });
      return mat;
    };

    /* --- meshes --- */
    K.add = function (geo, mat, pos, rot, opts) {
      var mesh = new THREE.Mesh(geo, mat);
      if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
      if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
      opts = opts || {};
      if (opts.shadow !== false) { mesh.castShadow = true; mesh.receiveShadow = true; }
      (opts.parent || root).add(mesh);
      K.own(geo);
      return mesh;
    };
    K.roundedBoxGeo = function (w, h, d, r) {
      r = Math.min(r == null ? 0.05 : r, w / 2 - 0.001, h / 2 - 0.001);
      var shape = new THREE.Shape();
      var x = -w / 2, y = -h / 2;
      shape.moveTo(x + r, y);
      shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r);
      shape.lineTo(x + w, y + h - r); shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      shape.lineTo(x + r, y + h); shape.quadraticCurveTo(x, y + h, x, y + h - r);
      shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y);
      var geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 6 });
      geo.translate(0, 0, -d / 2);
      return geo;
    };
    K.rbox = function (w, h, d, mat, pos, rot, opts) { return K.add(K.roundedBoxGeo(w, h, d, (opts && opts.r) || 0.05), mat, pos, rot, opts); };
    K.box = function (w, h, d, mat, pos, rot, opts) { return K.add(new THREE.BoxGeometry(w, h, d), mat, pos, rot, opts); };
    K.cyl = function (rTop, rBot, h, mat, pos, rot, opts) { return K.add(new THREE.CylinderGeometry(rTop, rBot, h, (opts && opts.seg) || 36), mat, pos, rot, opts); };
    K.sph = function (r, mat, pos, opts) { return K.add(new THREE.SphereGeometry(r, 26, 18), mat, pos, null, opts); };
    K.torus = function (r, tube, mat, pos, rot, opts) { return K.add(new THREE.TorusGeometry(r, tube, 18, 90), mat, pos, rot, opts); };
    K.cone = function (r, h, mat, pos, rot, opts) { return K.add(new THREE.ConeGeometry(r, h, 32), mat, pos, rot, opts); };
    K.capsule = function (r, len, mat, pos, rot, opts) {
      var geo = THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(r, len, 6, 18) : new THREE.CylinderGeometry(r, r, len + r * 2, 18);
      return K.add(geo, mat, pos, rot, opts);
    };

    /* --- canvas textures --- */
    K.texture = function (w, h, draw) {
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      var tex = new THREE.CanvasTexture(c);
      tex.anisotropy = Math.min(8, (ctx.renderer.capabilities && ctx.renderer.capabilities.getMaxAnisotropy) ? ctx.renderer.capabilities.getMaxAnisotropy() : 4);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      K.textures.push(tex);
      return tex;
    };
    K.screen = function (w, h, draw, opts) {
      opts = opts || {};
      var tex = K.texture(512, Math.round(512 * (h / w)), function (g, cw, ch) {
        var s = cw / w;
        g.save();
        g.scale(s, s);
        draw(g, w, h);
        g.restore();
      });
      var mat = K.own(new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: opts.glow == null ? 0.22 : Math.min(0.5, opts.glow * 0.55), roughness: 0.46, metalness: 0.01 }));
      return mat;
    };

    /* --- stage language: technical board, civic forum, map table, or workshop --- */
    K.stage = function (opts) {
      opts = opts || {};
      var style = opts.style || ctx.style || styleFor(ctx.kind);
      var floorTex = K.texture(512, 512, function (g) {
        var palettes = {
          technical: ['#eef0ef', '#cbd0d1', '#9ba3a6'],
          civic: ['#ddd7cc', '#aaa79f', '#747a7b'],
          cartographic: ['#e1d7c3', '#b9ad95', '#777d79'],
          workshop: ['#c7a987', '#987b5c', '#5d5c58'],
          diorama: ['#c8c9c5', '#9fa5a7', '#69737a']
        };
        var pc = palettes[style] || palettes.diorama;
        var grad = style === 'technical' ? g.createLinearGradient(0, 0, 512, 512) : g.createRadialGradient(256, 256, 40, 256, 256, 300);
        grad.addColorStop(0, pc[0]);
        grad.addColorStop(0.58, pc[1]);
        grad.addColorStop(1, pc[2]);
        g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
        g.globalAlpha = style === 'technical' ? 0.08 : 0.14;
        var seed = 218;
        function noise() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
        for (var n = 0; n < 2600; n++) {
          var v = 110 + Math.floor(noise() * 70);
          g.fillStyle = 'rgb(' + v + ',' + v + ',' + Math.max(100, v - 5) + ')';
          g.fillRect(noise() * 512, noise() * 512, 1.2, 1.2);
        }
        g.globalAlpha = 1;
        if (style === 'technical') {
          g.globalAlpha = 1; g.strokeStyle = 'rgba(42,55,63,.18)'; g.lineWidth = 1;
          for (var i = 0; i <= 20; i++) {
            g.beginPath(); g.moveTo(i * 25.6, 0); g.lineTo(i * 25.6, 512); g.stroke();
            g.beginPath(); g.moveTo(0, i * 25.6); g.lineTo(512, i * 25.6); g.stroke();
          }
          g.strokeStyle = 'rgba(150,26,19,.52)'; g.lineWidth = 3;
          g.strokeRect(34, 34, 444, 444);
          for (var t = 0; t < 18; t++) {
            var o = 44 + t * 24;
            g.beginPath(); g.moveTo(o, 34); g.lineTo(o, t % 2 ? 45 : 52); g.stroke();
            g.beginPath(); g.moveTo(34, o); g.lineTo(t % 2 ? 45 : 52, o); g.stroke();
          }
        } else if (style === 'cartographic') {
          g.globalAlpha = 1;
          for (var c = 0; c < 7; c++) {
            g.strokeStyle = 'rgba(27,42,74,' + (0.11 + c * 0.012) + ')'; g.lineWidth = 1.4;
            g.beginPath();
            for (var a = 0; a <= 120; a++) {
              var ang = a / 120 * Math.PI * 2;
              var rr = 58 + c * 26 + Math.sin(ang * 3 + c) * 8 + Math.cos(ang * 5 - c) * 5;
              var xx = 256 + Math.cos(ang) * rr, yy = 256 + Math.sin(ang) * rr;
              if (!a) g.moveTo(xx, yy); else g.lineTo(xx, yy);
            }
            g.closePath(); g.stroke();
          }
        } else if (style === 'workshop') {
          g.globalAlpha = 1;
          for (var y = 32; y < 512; y += 42) {
            g.strokeStyle = 'rgba(62,42,26,.16)'; g.lineWidth = 1.4;
            g.beginPath(); g.moveTo(0, y + Math.sin(y) * 3); g.bezierCurveTo(130, y - 5, 340, y + 7, 512, y - 2); g.stroke();
          }
        } else {
          g.globalAlpha = 1; g.strokeStyle = 'rgba(167,188,190,.32)'; g.lineWidth = 3;
          g.beginPath(); g.arc(256, 256, 214, 0, Math.PI * 2); g.stroke();
          g.strokeStyle = 'rgba(35,46,54,.22)'; g.lineWidth = 2;
          g.beginPath(); g.arc(256, 256, 246, 0, Math.PI * 2); g.stroke();
        }
      });
      var floorMat = K.own(new THREE.MeshPhysicalMaterial({ map: floorTex, roughness: style === 'technical' ? 0.64 : 0.84, metalness: style === 'technical' ? 0.08 : 0.015, clearcoat: style === 'workshop' ? 0.1 : 0.03, clearcoatRoughness: 0.76 }));
      var stage;
      if (style === 'technical') {
        stage = K.rbox(7.25, 0.14, 5.25, floorMat, [0, -0.09, 0], null, { r: 0.12 });
        K.rbox(7.38, 0.09, 5.38, K.mat.metal(0x566168, 0.6), [0, -0.2, 0], null, { r: 0.13 });
      } else if (style === 'workshop') {
        stage = K.rbox(7.05, 0.18, 5.05, floorMat, [0, -0.08, 0], null, { r: 0.16 });
        K.rbox(7.18, 0.1, 5.18, K.mat.metal(0x5d6467, 0.66), [0, -0.22, 0], null, { r: 0.17 });
      } else if (style === 'cartographic') {
        stage = K.add(new THREE.CylinderGeometry(3.58, 3.7, 0.13, 72), floorMat, [0, -0.08, 0]);
        K.cyl(3.7, 3.84, 0.09, K.mat.metal(0x59666a, 0.64), [0, -0.19, 0]);
        K.torus(3.59, 0.013, K.mat.metal(opts.lip == null ? 0xa7895f : opts.lip, 0.68), [0, -0.005, 0], [Math.PI / 2, 0, 0], { shadow: false });
      } else {
        stage = K.add(new THREE.CylinderGeometry(3.6, 3.72, 0.14, style === 'civic' ? 10 : 72), floorMat, [0, -0.09, 0]);
        K.cyl(3.72, 3.86, 0.1, K.mat.metal(style === 'civic' ? 0x555d60 : 0x4e5a61, 0.62), [0, -0.2, 0], null, { seg: style === 'civic' ? 10 : 72 });
        K.torus(3.62, 0.014, K.mat.metal(opts.lip == null ? (style === 'civic' ? 0x9d7757 : 0x6d888a) : opts.lip, 0.64), [0, -0.015, 0], [Math.PI / 2, 0, 0], { shadow: false });
      }
      stage.receiveShadow = true;
      return stage;
    };

    /* --- neutral museum-scale people: restrained, non-caricature proportions --- */
    K.person = function (opts) {
      opts = opts || {};
      var g = new THREE.Group();
      (opts.parent || root).add(g);
      var tone = opts.tone || 0x81543d;
      var cloth = opts.color == null ? PAL.ink : opts.color;
      var bodyMat = K.mat.plastic(cloth, 0.76);
      var skin = K.mat.plastic(tone, 0.66);
      var pants = K.mat.plastic(opts.pants || 0x252b35, 0.82);
      var shoe = K.mat.plastic(0x17191d, 0.72);
      K.cyl(0.115, 0.165, 0.34, bodyMat, [0, 0.515, 0], null, { parent: g });
      K.cyl(0.045, 0.05, 0.07, skin, [0, 0.705, 0], null, { parent: g });
      var head = K.sph(0.082, skin, [0, 0.82, 0], { parent: g });
      head.scale.set(0.86, 1.12, 0.92);
      var hair = K.sph(0.083, K.mat.plastic(opts.hair || 0x2a201d, 0.9), [0, 0.852, -0.006], { parent: g });
      hair.scale.set(0.9, 0.52, 0.96);
      K.capsule(0.031, 0.2, bodyMat, [-0.145, 0.49, 0], [0, 0, 0.16], { parent: g });
      K.capsule(0.031, 0.2, bodyMat, [0.145, 0.49, 0], [0, 0, -0.16], { parent: g });
      K.sph(0.035, skin, [-0.175, 0.34, 0], { parent: g });
      K.sph(0.035, skin, [0.175, 0.34, 0], { parent: g });
      K.capsule(0.038, 0.27, pants, [-0.062, 0.18, 0], [0, 0, 0.012], { parent: g });
      K.capsule(0.038, 0.27, pants, [0.062, 0.18, 0], [0, 0, -0.012], { parent: g });
      K.rbox(0.08, 0.045, 0.13, shoe, [-0.065, 0.025, 0.035], null, { parent: g, r: 0.018 });
      K.rbox(0.08, 0.045, 0.13, shoe, [0.065, 0.025, 0.035], null, { parent: g, r: 0.018 });
      if (opts.pos) g.position.set(opts.pos[0], opts.pos[1] || 0, opts.pos[2]);
      if (opts.face != null) g.rotation.y = opts.face;
      if (opts.scale) g.scale.setScalar(opts.scale);
      return g;
    };

    /* --- animated data flow: pulses along a curve --- */
    K.flow = function (points, opts) {
      opts = opts || {};
      var curve = new THREE.CatmullRomCurve3(points.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
      var tubeMat = K.own(new THREE.MeshStandardMaterial({
        color: opts.color == null ? PAL.line : opts.color, transparent: true, opacity: opts.opacity == null ? 0.5 : opts.opacity,
        roughness: 0.58, metalness: 0.05, emissive: opts.color == null ? PAL.line : opts.color, emissiveIntensity: 0.045
      }));
      K.add(new THREE.TubeGeometry(curve, 40, opts.radius == null ? 0.017 : opts.radius, 10, false), tubeMat, null, null, { shadow: false, parent: opts.parent });
      var n = opts.pulses == null ? 3 : opts.pulses;
      if (n > 0) {
        var pulseGeo = new THREE.SphereGeometry(opts.pulseSize == null ? 0.034 : opts.pulseSize, 12, 8);
        var pulseMat = K.own(new THREE.MeshStandardMaterial({ color: opts.pulseColor == null ? PAL.teal : opts.pulseColor, emissive: opts.pulseColor == null ? PAL.teal : opts.pulseColor, emissiveIntensity: 0.58, roughness: 0.44 }));
        var inst = new THREE.InstancedMesh(pulseGeo, pulseMat, n);
        inst.castShadow = false; inst.receiveShadow = false;
        (opts.parent || root).add(inst);
        K.own(pulseGeo);
        var dummy = new THREE.Object3D();
        var speed = opts.speed == null ? 0.16 : opts.speed;
        K.onTick(function (t) {
          for (var i = 0; i < n; i++) {
            var u = (t * speed + i / n) % 1;
            var v = curve.getPointAt(u);
            dummy.position.copy(v);
            var s = 0.75 + 0.5 * Math.sin((u * 6.28) + t * 2);
            dummy.scale.setScalar(Math.max(0.35, s));
            dummy.updateMatrix();
            inst.setMatrixAt(i, dummy.matrix);
          }
          inst.instanceMatrix.needsUpdate = true;
        });
      }
      return curve;
    };

    /* --- holographic ring halo --- */
    K.halo = function (r, color, pos, opts) {
      opts = opts || {};
      var ring = K.torus(r, opts.tube == null ? 0.009 : opts.tube, K.mat.neon(color, 0.62), pos, [Math.PI / 2, 0, 0], { shadow: false, parent: opts.parent });
      K.onTick(function (t) {
        ring.rotation.z = t * (opts.spin == null ? 0.4 : opts.spin);
        ring.material.emissiveIntensity = 0.22 + 0.09 * Math.sin(t * 1.6 + r * 9);
      });
      return ring;
    };

    /* --- in-scene billboard label --- */
    K.tag = function (text, pos, opts) {
      opts = opts || {};
      var warn = !!opts.warn;
      var c = document.createElement('canvas');
      var g = c.getContext('2d');
      g.font = '700 34px "Segoe UI", Verdana, sans-serif';
      var w = Math.ceil(g.measureText(text).width) + 44;
      c.width = w; c.height = 62;
      g = c.getContext('2d');
      var style = ctx.style || styleFor(ctx.kind);
      var bg = style === 'cartographic' ? 'rgba(244,239,226,.97)' : style === 'civic' ? 'rgba(245,242,235,.97)' : 'rgba(248,249,248,.97)';
      g.fillStyle = warn ? 'rgba(250,231,227,.98)' : bg;
      g.beginPath();
      if (g.roundRect) { g.roundRect(1, 1, w - 2, 60, 14); } else { g.rect(1, 1, w - 2, 60); }
      g.fill();
      g.strokeStyle = warn ? '#B3261E' : (style === 'cartographic' ? '#8A6E47' : '#8B98A3');
      g.lineWidth = 2;
      g.stroke();
      g.font = '700 34px "Segoe UI", Verdana, sans-serif';
      g.fillStyle = warn ? '#8E1D17' : '#17202B';
      g.textBaseline = 'middle';
      g.fillText(text, 22, 33);
      var tex = new THREE.CanvasTexture(c);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      K.textures.push(tex);
      var mat = K.own(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      var sp = new THREE.Sprite(mat);
      var hgt = 0.15;
      var wid = Math.min(1.34, hgt * w / 62);
      sp.scale.set(wid, hgt, 1);
      sp.position.set(pos[0], pos[1], pos[2]);
      sp.renderOrder = 60;
      ctx.root.add(sp);
      return sp;
    };
    /* --- scan beam sweep --- */
    K.beam = function (w, h, color, pos, opts) {
      opts = opts || {};
      var mat = K.own(new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
      var plane = K.add(new THREE.PlaneGeometry(w, h), mat, pos, opts.rot || null, { shadow: false, parent: opts.parent });
      var range = opts.range == null ? 0.9 : opts.range;
      var axis = opts.axis || 'x';
      var base = pos[axis === 'x' ? 0 : axis === 'y' ? 1 : 2];
      K.onTick(function (t) {
        var ph = (Math.sin(t * (opts.speed == null ? 1.1 : opts.speed)) + 1) / 2;
        plane.position[axis] = base - range / 2 + ph * range;
        mat.opacity = 0.1 + 0.2 * Math.sin(ph * Math.PI);
      });
      return plane;
    };

    /* --- floating motion --- */
    K.float = function (obj, amp, speed, phase) {
      var baseY = obj.position.y;
      K.onTick(function (t) { obj.position.y = baseY + (amp == null ? 0.05 : amp) * Math.sin(t * (speed == null ? 1.2 : speed) + (phase || 0)); });
    };
    K.spin = function (obj, speed, axis) {
      K.onTick(function (t) { obj.rotation[axis || 'y'] = t * (speed == null ? 0.5 : speed); });
    };

    /* --- devices --- */
    K.phone = function (pos, rot, opts) {
      opts = opts || {};
      var g = new THREE.Group(); (opts.parent || root).add(g);
      K.rbox(0.34, 0.66, 0.045, K.mat.metal(0x2a3550, 0.35), [0, 0, 0], null, { parent: g, r: 0.05 });
      var scr = opts.screen || K.screen(34, 62, function (gg, w, h) {
        gg.fillStyle = '#0d1526'; gg.fillRect(0, 0, w, h);
        gg.fillStyle = '#1f3a5f'; gg.fillRect(w * 0.08, h * 0.06, w * 0.84, h * 0.16);
        for (var i = 0; i < 4; i++) { gg.fillStyle = i === 2 ? '#da291c' : '#00aeb3'; gg.globalAlpha = 0.85; gg.fillRect(w * 0.08, h * (0.3 + i * 0.16), w * 0.84, h * 0.1); }
      });
      K.add(new THREE.PlaneGeometry(0.3, 0.6), scr, [0, 0, 0.026], null, { parent: g, shadow: false });
      g.position.set(pos[0], pos[1], pos[2]);
      if (rot) g.rotation.set(rot[0], rot[1], rot[2]);
      return g;
    };
    K.cameraPod = function (pos, opts) {
      opts = opts || {};
      var g = new THREE.Group(); (opts.parent || root).add(g);
      K.cyl(0.028, 0.036, opts.h == null ? 1.5 : opts.h, K.mat.metal(0x9aa7b4, 0.3), [0, (opts.h == null ? 1.5 : opts.h) / 2, 0], null, { parent: g });
      var head = new THREE.Group(); g.add(head);
      head.position.y = opts.h == null ? 1.5 : opts.h;
      K.sph(0.085, K.mat.plastic(0x0e1626, 0.25), [0, 0, 0], { parent: head });
      K.sph(0.032, K.mat.neon(opts.on === false ? PAL.line : PAL.red, 1.6), [0, 0, 0.075], { parent: head, shadow: false });
      K.onTick(function (t) { head.rotation.y = Math.sin(t * 0.7 + pos[0]) * 0.7; });
      g.position.set(pos[0], 0, pos[2]);
      return g;
    };
    K.serverRack = function (pos, opts) {
      opts = opts || {};
      var g = new THREE.Group(); (opts.parent || root).add(g);
      K.rbox(0.62, 1.28, 0.5, K.mat.metal(0x33415c, 0.34), [0, 0.64, 0], null, { parent: g, r: 0.04 });
      var lights = [];
      for (var i = 0; i < 6; i++) {
        K.box(0.5, 0.012, 0.02, K.mat.plastic(0x0e1626, 0.3), [0, 0.22 + i * 0.18, 0.255], null, { parent: g, shadow: false });
        lights.push(K.sph(0.016, K.mat.neon(i === (opts.hot == null ? -1 : opts.hot) ? PAL.red : PAL.teal, 1.6), [0.19, 0.26 + i * 0.18, 0.26], { parent: g, shadow: false }));
      }
      K.onTick(function (t) { lights.forEach(function (L, li) { L.material.emissiveIntensity = 1.1 + Math.sin(t * 3 + li * 1.7) * 0.7; }); });
      g.position.set(pos[0], 0, pos[2]);
      if (opts.face != null) g.rotation.y = opts.face;
      return g;
    };
    K.fileCabinet = function (pos, opts) {
      opts = opts || {};
      var g = new THREE.Group(); (opts.parent || root).add(g);
      K.rbox(0.6, 0.92, 0.5, K.mat.plastic(0xcdb08b, 0.6), [0, 0.46, 0], null, { parent: g, r: 0.03 });
      for (var i = 0; i < 3; i++) {
        K.box(0.5, 0.015, 0.44, K.mat.plastic(0xb08f66, 0.55), [0, 0.2 + i * 0.28, 0.03], null, { parent: g });
        K.box(0.14, 0.03, 0.02, K.mat.metal(0x8f7650, 0.3), [0, 0.26 + i * 0.28, 0.26], null, { parent: g });
      }
      var open = opts.openDrawer;
      if (open != null) K.box(0.5, 0.2, 0.42, K.mat.plastic(0xc9a97e, 0.55), [0, 0.2 + open * 0.28, 0.28], null, { parent: g });
      g.position.set(pos[0], 0, pos[2]);
      if (opts.face != null) g.rotation.y = opts.face;
      return g;
    };
    K.archGate = function (pos, opts) {
      opts = opts || {};
      var g = new THREE.Group(); (opts.parent || root).add(g);
      var w = opts.w == null ? 1.3 : opts.w, h = opts.h == null ? 1.7 : opts.h;
      var post = K.mat.metal(0x3b4a68, 0.3);
      K.rbox(0.16, h, 0.3, post, [-w / 2, h / 2, 0], null, { parent: g, r: 0.04 });
      K.rbox(0.16, h, 0.3, post, [w / 2, h / 2, 0], null, { parent: g, r: 0.04 });
      K.rbox(w + 0.16, 0.16, 0.3, post, [0, h, 0], null, { parent: g, r: 0.04 });
      K.box(0.05, h - 0.2, 0.02, K.mat.neon(opts.light == null ? PAL.teal : opts.light, 0.9), [-w / 2 + 0.1, h / 2, 0.12], null, { parent: g, shadow: false });
      K.box(0.05, h - 0.2, 0.02, K.mat.neon(opts.light == null ? PAL.teal : opts.light, 0.9), [w / 2 - 0.1, h / 2, 0.12], null, { parent: g, shadow: false });
      if (opts.beam !== false) K.beam(w - 0.14, 0.02, opts.beamColor == null ? PAL.teal : opts.beamColor, [0, h * 0.55, 0.05], { axis: 'y', range: h * 0.72, speed: opts.beamSpeed == null ? 1.3 : opts.beamSpeed, parent: g, rot: [0, 0, 0] });
      g.position.set(pos[0], 0, pos[2]);
      if (opts.face != null) g.rotation.y = opts.face;
      return g;
    };

    return K;
  }

  /* ------------------------------------------------- shared scene helpers */
  function threeStepColors(ctx) {
    return { hi: ctx.riskOn ? PAL.red : (ctx.pathOn ? PAL.orange : PAL.teal) };
  }

  var SCENES = {};
  var ANCHORS = {};

  /* ============================== WEEK 1: map - ordinary tools, hidden rules */
  SCENES.map = function (K, ctx) {
    K.stage();
    var c = threeStepColors(ctx);
    K.person({ pos: [0, 0, 0], face: 0.4 });
    K.halo(0.5, PAL.teal, [0, 0.02, 0], { spin: 0.25 });
    /* everyday devices in an arc around the student */
    var ph = K.phone([-1.9, 0.72, 1.0], [0.15, 0.7, 0]);
    K.float(ph, 0.04, 1.1);
    K.cameraPod([-2.0, 0, -1.2], { h: 1.6 });
    /* payment terminal */
    var pay = new K.THREE.Group(); ctx.root.add(pay);
    K.rbox(0.42, 0.5, 0.3, K.mat.plastic(PAL.bone, 0.5), [0, 0.55, 0], null, { parent: pay, r: 0.05 });
    K.add(new K.THREE.PlaneGeometry(0.3, 0.2), K.screen(30, 20, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#00aeb3'; g.font = 'bold 9px monospace'; g.fillText('TAP TO PAY', w * 0.14, h * 0.42);
      g.fillStyle = '#ffcc66'; g.fillRect(w * 0.14, h * 0.58, w * 0.7, h * 0.16);
    }), [0, 0.66, 0.16], [-0.35, 0, 0], { parent: pay, shadow: false });
    pay.position.set(1.95, 0.28, 1.05); pay.rotation.y = -0.7;
    K.rbox(0.9, 0.55, 0.62, K.mat.metal(0xd7dee6, 0.4), [1.95, 0.28, 1.05], [0, -0.7, 0]);
    /* ID check kiosk */
    var idk = new K.THREE.Group(); ctx.root.add(idk);
    K.rbox(0.5, 1.15, 0.22, K.mat.metal(0x3b4a68, 0.32), [0, 0.58, 0], null, { parent: idk, r: 0.05 });
    K.add(new K.THREE.PlaneGeometry(0.36, 0.44), K.screen(36, 44, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 2; g.strokeRect(w * 0.2, h * 0.1, w * 0.6, h * 0.5);
      g.beginPath(); g.arc(w * 0.5, h * 0.28, w * 0.13, 0, 7); g.stroke();
      g.fillStyle = '#da291c'; g.fillRect(w * 0.16, h * 0.72, w * 0.68, h * 0.1);
      g.fillStyle = '#e8eef4'; g.font = '7px monospace'; g.fillText('VERIFY ID', w * 0.3, h * 0.94);
    }), [0, 0.78, 0.115], null, { parent: idk, shadow: false });
    idk.position.set(2.0, 0, -1.15); idk.rotation.y = -2.4;
    /* red data threads: harm travels through normal tools */
    var hot = ctx.riskOn ? PAL.red : (ctx.pathOn ? PAL.red : PAL.line);
    K.flow([[-1.9, 0.75, 1.0], [-0.9, 1.15, 0.55], [0, 0.85, 0]], { color: hot, pulseColor: hot === PAL.line ? PAL.teal : PAL.red, pulses: 2, speed: 0.12 });
    K.flow([[-2.0, 1.55, -1.2], [-1.0, 1.3, -0.6], [0, 0.9, 0]], { color: hot, pulseColor: hot === PAL.line ? PAL.teal : PAL.red, pulses: 2, speed: 0.1 });
    K.flow([[1.95, 0.6, 1.05], [1.0, 1.05, 0.55], [0, 0.85, 0]], { color: hot, pulseColor: hot === PAL.line ? PAL.teal : PAL.red, pulses: 2, speed: 0.14 });
    K.flow([[2.0, 0.9, -1.15], [1.0, 1.2, -0.6], [0, 0.9, 0]], { color: hot, pulseColor: hot === PAL.line ? PAL.teal : PAL.red, pulses: 2, speed: 0.11 });
    /* the noticing map: glowing table where observations land */
    var tbl = K.rbox(1.5, 0.06, 0.95, K.mat.glass(PAL.tealSoft, 0.5), [0, 0.5, 1.85], null, { r: 0.04 });
    K.cyl(0.05, 0.06, 0.5, K.mat.metal(), [-0.6, 0.25, 1.85]);
    K.cyl(0.05, 0.06, 0.5, K.mat.metal(), [0.6, 0.25, 1.85]);
    var entry = K.rbox(0.4, 0.02, 0.3, K.mat.neon(ctx.riskOn ? PAL.red : PAL.teal, 0.8), [0, 0.55, 1.8], null, { r: 0.02 });
    K.float(entry, 0.03, 1.6);
    K.halo(0.34, ctx.riskOn ? PAL.red : PAL.teal, [0, 0.6, 1.8], { spin: 0.6 });
    void tbl;
  };
  ANCHORS.map = [[-1.9, 0.85, 1.0], [0, 0.95, 0], [0, 0.65, 1.8]];

  /* ===================== WEEK 2: outcomelens - same rule, unequal outcomes */
  SCENES.outcomelens = function (K, ctx) {
    K.stage({ lip: ctx.riskOn ? PAL.red : PAL.teal });
    /* one shared rule gate over both lanes */
    K.archGate([-1.1, 0, 0], { w: 2.9, h: 1.55, beamSpeed: 0.9 });
    var ruleHolo = K.add(new K.THREE.PlaneGeometry(1.5, 0.42), K.mat.holo(PAL.teal, 0.5), [-1.1, 1.95, 0], null, { shadow: false });
    K.float(ruleHolo, 0.04, 1.0);
    /* two lanes */
    var laneA = K.box(1.1, 0.04, 5.6, K.mat.plastic(PAL.greenSoft, 0.55), [-0.62, 0.02, 0.0], [0, 0.12, 0]);
    var laneB = K.box(1.1, 0.04, 5.6, K.mat.plastic(PAL.redSoft, 0.55), [-1.6, 0.02, 0.0], [0, -0.12, 0]);
    void laneA; void laneB;
    /* open lane flow */
    K.flow([[-0.35, 0.22, -2.4], [-0.55, 0.22, 0], [-0.15, 0.22, 2.4]], { color: PAL.green, pulseColor: PAL.green, pulses: 4, speed: 0.12 });
    /* blocked lane: narrows into barrier */
    K.flow([[-1.85, 0.22, -2.4], [-1.62, 0.22, -0.4], [-1.78, 0.22, 0.9]], { color: ctx.pathOn || ctx.riskOn ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: 4, speed: 0.1 });
    var wall = K.rbox(1.15, 0.66, 0.1, K.mat.neon(PAL.red, ctx.riskOn ? 1.1 : 0.55), [-1.78, 0.33, 1.15], [0, -0.12, 0], { r: 0.04 });
    K.onTick(function (t) { wall.material.emissiveIntensity = (ctx.riskOn ? 1.0 : 0.5) + 0.2 * Math.sin(t * 3.2); });
    /* travellers */
    K.person({ pos: [-0.35, 0, -2.15], face: 3.05, color: PAL.teal, tone: 0x6f4a2f });
    K.person({ pos: [-0.18, 0, 1.7], face: 3.05, color: PAL.teal, tone: 0xc9986a });
    K.person({ pos: [-1.85, 0, -2.15], face: 3.05, color: PAL.orange, tone: 0x4a2f1d });
    K.person({ pos: [-1.75, 0, 0.55], face: 3.05, color: PAL.orange, tone: 0x8a5a3b });
    /* burden stack at the intersection */
    var stack = new K.THREE.Group(); ctx.root.add(stack); stack.position.set(1.35, 0, 0.9);
    for (var i = 0; i < 5; i++) {
      K.cyl(0.24 + i * 0.015, 0.26 + i * 0.015, 0.11, i > 2 ? K.mat.neon(PAL.red, ctx.riskOn ? 0.9 : 0.4) : K.mat.plastic(PAL.orange, 0.4), [0, 0.08 + i * 0.125, 0], null, { parent: stack });
    }
    K.halo(0.44, ctx.riskOn ? PAL.red : PAL.orange, [1.35, 0.78, 0.9], { spin: 0.5 });
    K.person({ pos: [1.35, 0, 1.75], face: 3.3, color: PAL.orange, scale: 0.92, tone: 0x4a2f1d });
    /* case cards holographic compare */
    var cardMatA = K.screen(46, 30, function (g, w, h) {
      g.fillStyle = '#eef7f1'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1c7a43'; g.fillRect(0, 0, w, h * 0.22);
      g.fillStyle = '#0d1526'; g.font = 'bold 7px sans-serif'; g.fillText('CASE A: APPROVED', w * 0.07, h * 0.15);
      g.fillStyle = '#8ba0b4'; for (var i2 = 0; i2 < 3; i2++) g.fillRect(w * 0.08, h * (0.36 + i2 * 0.18), w * 0.8, h * 0.08);
    }, { glow: 0.5 });
    var cardMatB = K.screen(46, 30, function (g, w, h) {
      g.fillStyle = '#fdf0ee'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#da291c'; g.fillRect(0, 0, w, h * 0.22);
      g.fillStyle = '#ffffff'; g.font = 'bold 7px sans-serif'; g.fillText('CASE B: DENIED', w * 0.07, h * 0.15);
      g.fillStyle = '#8ba0b4'; for (var i3 = 0; i3 < 3; i3++) g.fillRect(w * 0.08, h * (0.36 + i3 * 0.18), w * 0.8, h * 0.08);
    }, { glow: 0.5 });
    var cA = K.add(new K.THREE.PlaneGeometry(0.92, 0.6), cardMatA, [0.4, 1.35, -1.5], [0, -0.5, 0], { shadow: false });
    var cB = K.add(new K.THREE.PlaneGeometry(0.92, 0.6), cardMatB, [1.55, 1.35, -0.9], [0, -0.5, 0], { shadow: false });
    K.float(cA, 0.045, 1.1); K.float(cB, 0.045, 1.1, 1.4);
  };
  ANCHORS.outcomelens = [[-1.1, 1.6, 0], [-0.15, 0.3, 2.2], [1.35, 0.8, 0.9]];

  /* ======================= WEEK 3: pipeline - inequity built into a process */
  SCENES.pipeline = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn || ctx.pathOn;
    /* old records cabinet feeding the pipeline */
    K.fileCabinet([-2.5, 0, -0.1], { face: 0.5, openDrawer: 2 });
    K.halo(0.3, hot ? PAL.red : PAL.orange, [-2.5, 1.05, -0.1], { spin: 0.5 });
    /* conveyor */
    K.box(3.6, 0.09, 0.72, K.mat.metal(0x46536e, 0.42), [-0.3, 0.3, 0]);
    for (var i = 0; i < 7; i++) K.box(0.06, 0.1, 0.72, K.mat.metal(0x2c3852, 0.35), [-1.9 + i * 0.55, 0.3, 0]);
    /* record tokens riding the belt */
    var tokens = [];
    for (var r2 = 0; r2 < 3; r2++) tokens.push(K.rbox(0.3, 0.05, 0.4, r2 === 1 ? K.mat.neon(PAL.red, hot ? 0.9 : 0.35) : K.mat.plastic(PAL.bone, 0.4), [-1.7 + r2, 0.39, 0], null, { r: 0.02 }));
    K.onTick(function (t) {
      tokens.forEach(function (tok, ti) {
        var u = ((t * 0.14) + ti / 3) % 1;
        tok.position.x = -1.85 + u * 3.1;
        tok.position.y = 0.39 + Math.sin(u * Math.PI) * 0.005;
      });
    });
    /* scoring machine */
    var machine = new K.THREE.Group(); ctx.root.add(machine);
    K.rbox(1.15, 1.25, 1.0, K.mat.metal(0x33415c, 0.32), [0, 0.62, 0], null, { parent: machine, r: 0.06 });
    K.add(new K.THREE.PlaneGeometry(0.8, 0.5), K.screen(64, 40, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 2;
      g.beginPath(); g.arc(w * 0.5, h * 0.95, w * 0.32, Math.PI, Math.PI * 2); g.stroke();
      g.strokeStyle = '#da291c'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(w * 0.5, h * 0.95); g.lineTo(w * 0.72, h * 0.42); g.stroke();
      g.fillStyle = '#ffcc66'; g.font = 'bold 8px monospace'; g.fillText('SCORE', w * 0.38, h * 0.3);
    }), [0, 0.86, 0.51], null, { parent: machine, shadow: false });
    machine.position.set(0.55, 0.28, 0);
    K.beam(1.0, 0.02, hot ? PAL.red : PAL.teal, [0.55, 0.75, 0.52], { axis: 'y', range: 0.6, speed: 1.7 });
    /* decision stamp: approved / denied doors */
    K.rbox(0.9, 0.1, 0.7, K.mat.plastic(PAL.greenSoft, 0.5), [2.45, 0.09, -0.75], null, { r: 0.04 });
    K.rbox(0.9, 0.1, 0.7, K.mat.plastic(PAL.redSoft, 0.5), [2.45, 0.09, 0.75], null, { r: 0.04 });
    K.person({ pos: [2.45, 0.13, -0.75], face: -1.4, color: PAL.green, scale: 0.9, tone: 0xc9986a });
    K.person({ pos: [2.45, 0.13, 0.75], face: -1.7, color: PAL.red, scale: 0.9, tone: 0x4a2f1d });
    K.flow([[1.15, 0.9, 0], [1.9, 0.85, -0.4], [2.45, 0.35, -0.75]], { color: PAL.green, pulseColor: PAL.green, pulses: 2, speed: 0.13 });
    K.flow([[1.15, 0.9, 0], [1.9, 0.85, 0.4], [2.45, 0.35, 0.75]], { color: hot ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: 3, speed: 0.15 });
    /* taint thread from the cabinet into the machine */
    K.flow([[-2.5, 0.75, -0.1], [-1.6, 1.05, -0.25], [-0.4, 0.85, -0.1], [0.4, 0.9, 0]], { color: hot ? PAL.red : PAL.orange, pulseColor: PAL.red, pulses: 3, speed: 0.1 });
  };
  ANCHORS.pipeline = [[-2.5, 1.0, -0.1], [0.55, 1.3, 0], [2.45, 0.5, 0.75]];

  /* ========================== WEEK 4: switches - defaults decide first */
  SCENES.switches = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* console desk */
    var desk = new K.THREE.Group(); ctx.root.add(desk);
    K.rbox(3.1, 0.14, 1.35, K.mat.metal(0x3b4a68, 0.35), [0, 0.52, 0], [-0.32, 0, 0], { parent: desk, r: 0.05 });
    K.rbox(3.15, 0.5, 1.0, K.mat.plastic(0x2c3852, 0.5), [0, 0.22, 0.1], null, { parent: desk, r: 0.05 });
    desk.position.set(-0.55, 0, -0.2);
    /* four big physical toggles, pre-flipped */
    var knobs = [];
    for (var i = 0; i < 4; i++) {
      var on = i < (ctx.pathOn ? 3 : 1);
      var bx = -1.75 + i * 0.82;
      K.rbox(0.5, 0.05, 0.3, K.mat.plastic(0x1f2b45, 0.4), [bx, 0.63 + 0.11, -0.25 + 0.05], [-0.32, 0, 0], { r: 0.03 });
      var knob = K.capsule(0.055, 0.12, on ? K.mat.neon(hot ? PAL.red : PAL.orange, 0.9) : K.mat.plastic(PAL.steel, 0.3), [bx + (on ? 0.1 : -0.1), 0.78, -0.22], [0, 0, on ? -0.7 : 0.7]);
      knobs.push({ k: knob, on: on });
      K.sph(0.025, K.mat.neon(on ? (hot ? PAL.red : PAL.orange) : PAL.teal, 1.4), [bx, 0.72, -0.02], { shadow: false });
    }
    void knobs;
    /* holographic "DEFAULT" readout */
    var holoPanel = K.add(new K.THREE.PlaneGeometry(1.7, 0.5), K.mat.holo(hot ? PAL.red : PAL.teal, 0.5), [-0.55, 1.55, -0.4], [0, 0, 0], { shadow: false });
    K.float(holoPanel, 0.05, 0.9);
    /* the output door: fits one silhouette, not the other */
    var door = new K.THREE.Group(); ctx.root.add(door);
    K.rbox(0.2, 1.6, 1.5, K.mat.metal(0x46536e, 0.3), [0, 0.8, 0], null, { parent: door, r: 0.05 });
    /* cut-out silhouette suggestion: glowing person-shaped outline */
    K.capsule(0.13, 0.34, K.mat.neon(PAL.teal, 0.7), [0.11, 0.62, 0.25], null, { parent: door, shadow: false });
    K.sph(0.1, K.mat.neon(PAL.teal, 0.7), [0.11, 0.98, 0.25], { parent: door, shadow: false });
    door.position.set(2.3, 0, -0.15); door.rotation.y = -0.25;
    /* one person fits, one must adapt */
    K.person({ pos: [1.45, 0, 0.35], face: -1.2, color: PAL.teal, tone: 0xc9986a });
    var adapting = K.person({ pos: [1.35, 0, 1.35], face: -1.0, color: PAL.orange, tone: 0x4a2f1d });
    adapting.rotation.z = hot ? 0.16 : 0.08;
    if (hot) K.halo(0.4, PAL.red, [1.35, 0.05, 1.35], { spin: 0.7 });
    /* wiring from console to door */
    K.flow([[-0.55, 0.6, -0.2], [0.7, 0.5, 0.1], [2.1, 0.5, -0.1]], { color: ctx.pathOn || hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.14 });
  };
  ANCHORS.switches = [[-1.75, 0.85, -0.2], [-0.55, 1.5, -0.4], [2.3, 0.9, -0.15]];

  /* ============= WEEK 5 overview: audit - slice the benchmark, find the gaze */
  SCENES.audit = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* central benchmark table */
    K.cyl(1.35, 1.45, 0.12, K.mat.metal(0x3b4a68, 0.3), [0, 0.42, 0]);
    K.cyl(0.16, 0.2, 0.42, K.mat.metal(0x2c3852, 0.3), [0, 0.2, 0]);
    /* four trays as quadrants with face-tile mosaics */
    var groups = [
      { a: 0, err: 0.06, label: 'LM' }, { a: Math.PI / 2, err: 0.12, label: 'LW' },
      { a: Math.PI, err: 0.08, label: 'DM' }, { a: -Math.PI / 2, err: 0.35, label: 'DW' }
    ];
    groups.forEach(function (gr, gi) {
      var gx = Math.cos(gr.a) * 0.72, gz = Math.sin(gr.a) * 0.72;
      var worst = gi === 3;
      var trayMat = K.screen(40, 40, function (g, w, h) {
        g.fillStyle = worst ? '#fdf0ee' : '#f2f7fa'; g.fillRect(0, 0, w, h);
        for (var yy = 0; yy < 4; yy++) for (var xx = 0; xx < 4; xx++) {
          var bad = Math.random() < gr.err;
          g.fillStyle = bad ? '#da291c' : '#9fb3c4';
          g.beginPath(); g.arc(w * (0.16 + xx * 0.225), h * (0.16 + yy * 0.225), w * 0.07, 0, 7); g.fill();
        }
      }, { glow: worst && hot ? 0.8 : 0.4 });
      K.add(new K.THREE.PlaneGeometry(0.92, 0.92), trayMat, [gx, 0.492, gz], [-Math.PI / 2, 0, -gr.a + Math.PI / 2], { shadow: false });
      if (worst) {
        var ring = K.halo(0.55, PAL.red, [gx, 0.52, gz], { spin: hot ? 0.9 : 0.4 });
        void ring;
        for (var p = 0; p < 4; p++) K.cyl(0.016, 0.016, 0.4, K.mat.neon(PAL.red, 1.1), [gx - 0.22 + (p % 2) * 0.4, 0.72, gz - 0.2 + Math.floor(p / 2) * 0.4]);
      }
    });
    /* the average panel that hides the cluster */
    var avg = K.add(new K.THREE.PlaneGeometry(1.15, 0.62), K.screen(58, 32, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1c7a43'; g.font = 'bold 12px monospace'; g.fillText('AVG 94%', w * 0.09, h * 0.42);
      g.fillStyle = '#8ba0b4'; g.font = '6px monospace'; g.fillText('OVERALL ACCURACY', w * 0.09, h * 0.62);
      g.fillStyle = '#da291c'; g.font = 'bold 7px monospace'; g.fillText('DW ERROR 35%', w * 0.09, h * 0.86);
    }, { glow: 0.65 }), [0, 1.5, -0.9], [0, 0.15, 0], { shadow: false });
    K.float(avg, 0.05, 1.0);
    /* scan beam sweeping the table */
    K.beam(2.8, 0.02, hot ? PAL.red : PAL.teal, [0, 0.62, 0], { axis: 'y', range: 0.5, speed: 1.2 });
    /* auditor figure */
    K.person({ pos: [-2.05, 0, 1.15], face: 0.9, color: PAL.teal, tone: 0x4a2f1d });
    K.phone([-1.75, 0.86, 0.9], [0.4, 0.9, 0]);
  };
  ANCHORS.audit = [[0, 0.62, 0], [0, 1.5, -0.9], [0.0, 0.55, 0.72]];

  /* ================== WEEK 6: gate - surveillance turns movement into risk */
  SCENES.gate = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* checkpoint arch with sweep */
    K.archGate([0, 0, 0], { w: 1.5, h: 1.8, beamColor: hot ? PAL.red : PAL.teal, light: hot ? PAL.red : PAL.teal });
    K.cameraPod([-0.95, 0, -0.45], { h: 1.9 });
    K.cameraPod([0.95, 0, -0.5], { h: 1.75 });
    /* travellers queued */
    K.person({ pos: [-0.05, 0, -1.9], face: 0, color: PAL.teal, tone: 0xc9986a });
    K.person({ pos: [0.35, 0, -2.6], face: 0.2, color: PAL.ink, tone: 0x8a5a3b });
    var flagged = K.person({ pos: [0, 0, 0.9], face: 0, color: PAL.orange, tone: 0x4a2f1d });
    void flagged;
    /* flag halo over the flagged traveller */
    var flag = K.cone(0.09, 0.22, K.mat.neon(hot ? PAL.red : PAL.orange, 1.4), [0, 1.28, 0.9], [Math.PI, 0, 0], { shadow: false });
    K.float(flag, 0.06, 2.2);
    K.halo(0.34, hot ? PAL.red : PAL.orange, [0, 0.03, 0.9], { spin: 0.8 });
    /* database obelisks receiving the flag */
    K.serverRack([2.3, 0, 0.4], { face: -0.9, hot: hot ? 2 : -1 });
    K.serverRack([2.6, 0, -0.9], { face: -0.7 });
    K.flow([[0, 1.25, 0.9], [1.1, 1.35, 0.7], [2.3, 0.9, 0.4]], { color: hot ? PAL.red : PAL.orange, pulseColor: PAL.red, pulses: 3, speed: 0.16 });
    K.flow([[2.3, 0.9, 0.4], [2.5, 1.1, -0.3], [2.6, 0.85, -0.9]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 2, speed: 0.1 });
    /* who decides: empty accountability desk, chair turned away */
    K.rbox(1.05, 0.07, 0.6, K.mat.plastic(PAL.bone, 0.5), [-2.3, 0.52, 0.9], [0, 0.5, 0], { r: 0.03 });
    K.cyl(0.05, 0.06, 0.52, K.mat.metal(), [-2.3, 0.26, 0.9]);
    K.rbox(0.4, 0.5, 0.08, K.mat.plastic(0x2c3852, 0.5), [-2.75, 0.5, 1.25], [0, 0.9, 0], { r: 0.04 });
    var q = K.add(new K.THREE.PlaneGeometry(0.5, 0.5), K.mat.holo(PAL.orange, 0.55), [-2.3, 1.25, 0.9], [0, 0.6, 0], { shadow: false });
    K.float(q, 0.05, 1.3);
  };
  ANCHORS.gate = [[0, 1.5, 0], [1.2, 1.1, 0.6], [-2.3, 1.0, 0.9]];

  /* ================= WEEK 7: review - the gallery pause (no new content) */
  SCENES.review = function (K, ctx) {
    K.stage({ lip: PAL.teal });
    /* six week-plinths in a gentle arc, like a museum hallway */
    var weeks = ['1', '2', '3', '4', '5', '6'];
    weeks.forEach(function (wk, i) {
      var a = -1.15 + i * 0.46;
      var x = Math.sin(a) * 2.5, z = -Math.cos(a) * 1.55;
      var lift = ctx.pathOn ? (i === 1 ? 0.14 : 0) : 0;
      K.cyl(0.26, 0.3, 0.5 + lift, K.mat.plastic(PAL.bone, 0.5), [x, (0.5 + lift) / 2, z]);
      var chip = K.rbox(0.34, 0.34, 0.05, K.mat.glass(PAL.tealSoft, 0.5), [x, 0.78 + lift, z], [0, -a, 0], { r: 0.04 });
      K.float(chip, 0.035, 1.1, i * 0.7);
      var numMat = K.screen(24, 24, function (g, w, h) {
        g.fillStyle = '#10233f'; g.fillRect(0, 0, w, h);
        g.fillStyle = i === 4 && ctx.riskOn ? '#da291c' : '#7ef0f2'; g.font = 'bold 14px sans-serif';
        g.fillText('W' + wk, w * 0.2, h * 0.68);
      }, { glow: 0.7 });
      K.add(new K.THREE.PlaneGeometry(0.28, 0.28), numMat, [x, 0.78 + lift, z + 0.032], [0, -a, 0], { shadow: false });
    });
    /* connecting thread: the pattern that keeps returning */
    K.flow([[-2.28, 0.8, 0.63], [-1.5, 1.0, -0.6], [-0.5, 1.0, -1.35], [0.55, 1.0, -1.32], [1.55, 1.0, -0.55], [2.28, 0.8, 0.63]], { color: PAL.teal, pulseColor: ctx.riskOn ? PAL.red : PAL.teal, pulses: 4, speed: 0.07 });
    /* the bench: rest is part of the design */
    K.rbox(1.3, 0.09, 0.45, K.mat.plastic(0xcdb08b, 0.55), [0, 0.42, 1.5], null, { r: 0.04 });
    K.box(0.09, 0.4, 0.4, K.mat.metal(0x8a7a64, 0.4), [-0.52, 0.2, 1.5]);
    K.box(0.09, 0.4, 0.4, K.mat.metal(0x8a7a64, 0.4), [0.52, 0.2, 1.5]);
    K.person({ pos: [0.15, 0.44, 1.45], face: 2.7, scale: 0.94, color: PAL.teal, tone: 0x8a5a3b });
    K.halo(0.5, PAL.teal, [0, 0.05, 1.5], { spin: 0.2 });
  };
  ANCHORS.review = [[-2.28, 0.9, 0.63], [0, 1.05, -1.34], [0, 0.6, 1.5]];

  /* =================== WEEK 8: vault - data is a story about people */
  SCENES.vault = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* circular vault door with rotating lock ring */
    var vault = new K.THREE.Group(); ctx.root.add(vault);
    K.cyl(1.05, 1.05, 0.3, K.mat.metal(0x3b4a68, 0.28), [0, 0, 0], [Math.PI / 2, 0, 0], { parent: vault });
    var lockRing = K.torus(0.62, 0.055, K.mat.metal(0xd7dee6, 0.2), [0, 0, 0.18], null, { parent: vault });
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3;
      K.cyl(0.045, 0.045, 0.34, K.mat.metal(0xb9c4cf, 0.25), [Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0.18], [Math.PI / 2, 0, 0], { parent: vault });
    }
    K.spin(lockRing, ctx.pathOn ? 0.6 : 0.18, 'z');
    K.sph(0.13, K.mat.neon(hot ? PAL.red : PAL.teal, 1.1), [0, 0, 0.26], { parent: vault, shadow: false });
    vault.position.set(-1.5, 1.05, -0.55); vault.rotation.y = 0.55;
    K.rbox(2.5, 2.1, 0.24, K.mat.plastic(0x2c3852, 0.55), [-1.85, 1.05, -0.9], [0, 0.55, 0], { r: 0.07 });
    /* story cards drifting out of the vault */
    for (var s = 0; s < 3; s++) {
      var cardMat = K.screen(40, 26, function (g, w, h) {
        g.fillStyle = '#fdfbf6'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#1b2a4a'; g.fillRect(w * 0.08, h * 0.14, w * 0.5, h * 0.12);
        g.fillStyle = '#8ba0b4'; g.fillRect(w * 0.08, h * 0.4, w * 0.84, h * 0.08);
        g.fillRect(w * 0.08, h * 0.58, w * 0.84, h * 0.08);
        g.fillStyle = s === 1 && hot ? '#da291c' : '#00aeb3'; g.beginPath(); g.arc(w * 0.85, h * 0.2, w * 0.06, 0, 7); g.fill();
      }, { glow: 0.5 });
      var card = K.add(new K.THREE.PlaneGeometry(0.72, 0.47), cardMat, [-0.35 + s * 0.75, 1.15 + (s % 2) * 0.3, 0.15 + s * 0.28], [0, -0.35, 0], { shadow: false });
      K.float(card, 0.05, 1.0, s * 0.9);
    }
    /* the key pedestal: who holds authority */
    K.cyl(0.2, 0.26, 0.62, K.mat.plastic(PAL.bone, 0.5), [1.75, 0.31, 0.85]);
    var key = new K.THREE.Group(); ctx.root.add(key);
    K.torus(0.09, 0.03, K.mat.metal(0xd9b64a, 0.25), [0, 0.13, 0], null, { parent: key });
    K.cyl(0.028, 0.028, 0.3, K.mat.metal(0xd9b64a, 0.25), [0, -0.08, 0], null, { parent: key });
    K.box(0.09, 0.035, 0.028, K.mat.metal(0xd9b64a, 0.25), [0.045, -0.19, 0], null, { parent: key });
    key.position.set(1.75, 0.78, 0.85);
    K.spin(key, 0.5); K.float(key, 0.05, 1.4);
    K.halo(0.3, hot ? PAL.red : PAL.amber, [1.75, 0.66, 0.85], { spin: 0.7 });
    /* community circle: the people the data is about */
    [[0.85, 1.7], [1.5, 2.0], [2.3, 1.65]].forEach(function (p, pi) {
      K.person({ pos: [p[0], 0, p[1]], face: -0.4 - pi * 0.5, scale: 0.9, color: pi === 1 ? PAL.teal : PAL.ink, tone: [0x4a2f1d, 0x8a5a3b, 0xc9986a][pi] });
    });
    K.flow([[1.75, 0.85, 0.85], [0.6, 1.3, 0.3], [-0.9, 1.15, -0.3]], { color: ctx.pathOn ? PAL.teal : PAL.line, pulseColor: PAL.teal, pulses: 2, speed: 0.1 });
  };
  ANCHORS.vault = [[-1.5, 1.15, -0.55], [0.4, 1.35, 0.4], [1.75, 0.8, 0.85]];

  /* ============ WEEK 9: benevolence - the helpful kiosk with a hidden funnel */
  SCENES.benevolence = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* polished help kiosk */
    var kiosk = new K.THREE.Group(); ctx.root.add(kiosk);
    K.rbox(0.95, 1.5, 0.35, K.mat.plastic(PAL.white, 0.25), [0, 0.75, 0], null, { parent: kiosk, r: 0.09 });
    K.add(new K.THREE.PlaneGeometry(0.7, 0.8), K.screen(56, 64, function (g, w, h) {
      g.fillStyle = '#eafefe'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#00aeb3'; g.font = 'bold 9px sans-serif'; g.fillText('HOW CAN', w * 0.2, h * 0.2);
      g.fillText('WE HELP?', w * 0.2, h * 0.32);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 2.4;
      g.beginPath(); g.arc(w * 0.5, h * 0.6, w * 0.17, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); /* smile */
      g.beginPath(); g.arc(w * 0.38, h * 0.52, 2.4, 0, 7); g.stroke();
      g.beginPath(); g.arc(w * 0.62, h * 0.52, 2.4, 0, 7); g.stroke();
      g.fillStyle = '#ffa12b'; g.fillRect(w * 0.2, h * 0.82, w * 0.6, h * 0.1);
    }, { glow: 0.7 }), [0, 0.95, 0.19], null, { parent: kiosk, shadow: false });
    kiosk.position.set(-1.1, 0, 0.4); kiosk.rotation.y = 0.35;
    K.person({ pos: [-1.05, 0, 1.6], face: 2.9, color: PAL.teal, tone: 0x8a5a3b });
    /* the promise glow */
    K.halo(0.6, PAL.teal, [-1.1, 0.04, 0.4], { spin: 0.3 });
    /* hidden funnel behind: data droplets falling into a dark intake */
    var funnel = new K.THREE.Group(); ctx.root.add(funnel);
    K.add(new K.THREE.CylinderGeometry(0.75, 0.1, 0.8, 40, 1, true), K.mat.glass(hot ? 0xf3b7ae : PAL.tealSoft, 0.4), [0, 0.75, 0], null, { parent: funnel });
    K.cyl(0.16, 0.2, 0.35, K.mat.plastic(0x101a2e, 0.35), [0, 0.18, 0], null, { parent: funnel });
    funnel.position.set(1.15, 0, -0.75);
    var drops = [];
    for (var d = 0; d < 6; d++) drops.push(K.sph(0.045, K.mat.neon(hot ? PAL.red : PAL.orange, 1.2), [1.15, 1.2, -0.75], { shadow: false }));
    K.onTick(function (t) {
      drops.forEach(function (dr, di) {
        var u = ((t * 0.4) + di / 6) % 1;
        var rr = 0.62 * (1 - u * 0.85);
        var aa = di * 1.05 + t * 0.7;
        dr.position.set(1.15 + Math.cos(aa) * rr, 1.28 - u * 0.85, -0.75 + Math.sin(aa) * rr);
        dr.scale.setScalar(1 - u * 0.45);
      });
    });
    /* pipe from kiosk into funnel */
    K.flow([[-0.85, 0.7, 0.25], [0.2, 0.5, -0.3], [1.15, 0.45, -0.72]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.orange, pulses: 3, speed: 0.14 });
    /* dark storage under the floor line */
    K.serverRack([2.45, 0, -0.35], { face: -0.8, hot: hot ? 4 : -1 });
    K.flow([[1.15, 0.15, -0.75], [1.8, 0.3, -0.55], [2.45, 0.6, -0.35]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 2, speed: 0.12 });
    /* scale: promise vs power */
    var scalePost = K.cyl(0.035, 0.045, 1.15, K.mat.metal(), [2.0, 0.58, 1.3]);
    void scalePost;
    var beamBar = K.box(1.1, 0.035, 0.06, K.mat.metal(0xd7dee6, 0.3), [2.0, 1.16, 1.3], [0, 0, hot ? -0.22 : -0.1]);
    K.sph(0.09, K.mat.neon(PAL.teal, 0.9), [1.52, 1.28, 1.3], { shadow: false });
    K.sph(0.13, K.mat.neon(hot ? PAL.red : PAL.orange, 1.0), [2.5, 1.02, 1.3], { shadow: false });
    void beamBar;
  };
  ANCHORS.benevolence = [[-1.1, 1.55, 0.4], [1.15, 0.8, -0.75], [2.45, 0.9, -0.35]];

  /* ========== WEEK 10: sorting - prediction decides who receives support */
  SCENES.sorting = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* incoming student records */
    K.box(2.4, 0.08, 0.66, K.mat.metal(0x46536e, 0.4), [-1.75, 0.28, 0]);
    var toks = [];
    for (var i = 0; i < 4; i++) {
      var tk = new K.THREE.Group(); ctx.root.add(tk);
      K.rbox(0.26, 0.34, 0.04, K.mat.plastic(PAL.bone, 0.35), [0, 0, 0], null, { parent: tk, r: 0.02 });
      K.sph(0.055, K.mat.plastic([0x4a2f1d, 0xc9986a, 0x8a5a3b, 0x6f4a2f][i], 0.45), [0, 0.06, 0.03], { parent: tk });
      K.box(0.16, 0.02, 0.01, K.mat.plastic(PAL.line, 0.4), [0, -0.07, 0.025], null, { parent: tk });
      toks.push(tk);
    }
    K.onTick(function (t) {
      toks.forEach(function (tk2, ti) {
        var u = ((t * 0.12) + ti / 4) % 1;
        tk2.position.set(-2.75 + u * 2.1, 0.5 + Math.sin(u * 9 + ti) * 0.015, 0);
        tk2.rotation.y = 0.15;
      });
    });
    /* threshold gate: laser cutoff line */
    var gate = new K.THREE.Group(); ctx.root.add(gate);
    K.rbox(0.14, 1.35, 0.75, K.mat.metal(0x33415c, 0.3), [0, 0.67, -0.5], null, { parent: gate, r: 0.05 });
    K.rbox(0.14, 1.35, 0.75, K.mat.metal(0x33415c, 0.3), [0, 0.67, 0.5], null, { parent: gate, r: 0.05 });
    var cutoff = K.box(0.02, 0.02, 0.9, K.mat.neon(hot ? PAL.red : PAL.amber, 1.5), [0, 0.62, 0], null, { parent: gate, shadow: false });
    K.onTick(function (t) { cutoff.material.emissiveIntensity = 1.2 + 0.5 * Math.sin(t * 4); });
    var scoreMat = K.screen(40, 22, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffcc66'; g.font = 'bold 10px monospace'; g.fillText('SCORE>=71', w * 0.08, h * 0.62);
    }, { glow: 0.7 });
    K.add(new K.THREE.PlaneGeometry(0.7, 0.38), scoreMat, [0, 1.55, 0], null, { parent: gate, shadow: false });
    /* support desk lane vs waiting lane */
    K.rbox(1.3, 0.07, 0.72, K.mat.plastic(PAL.greenSoft, 0.5), [1.9, 0.5, -0.95], [0, 0.25, 0], { r: 0.03 });
    K.person({ pos: [2.4, 0, -1.35], face: -2.4, color: PAL.green, tone: 0xc9986a });
    K.person({ pos: [1.55, 0, -0.55], face: 0.7, scale: 0.94, color: PAL.teal, tone: 0x8a5a3b });
    /* waiting area: chairs, no desk */
    for (var ch = 0; ch < 3; ch++) {
      K.rbox(0.34, 0.06, 0.34, K.mat.plastic(0xd8dee6, 0.5), [1.5 + ch * 0.55, 0.3, 1.15], null, { r: 0.02 });
      K.box(0.34, 0.3, 0.05, K.mat.plastic(0xc7cfd9, 0.5), [1.5 + ch * 0.55, 0.46, 1.31]);
      K.cyl(0.03, 0.035, 0.3, K.mat.metal(), [1.5 + ch * 0.55, 0.15, 1.15]);
    }
    var waiting = K.person({ pos: [1.5, 0.36, 1.1], face: 3.1, scale: 0.9, color: PAL.orange, tone: 0x4a2f1d });
    void waiting;
    if (hot) K.halo(0.4, PAL.red, [1.5, 0.03, 1.12], { spin: 0.6 });
    /* flows after the gate */
    K.flow([[0.1, 0.55, -0.05], [0.9, 0.6, -0.5], [1.85, 0.6, -0.95]], { color: PAL.green, pulseColor: PAL.green, pulses: 2, speed: 0.13 });
    K.flow([[0.1, 0.5, 0.05], [0.8, 0.45, 0.6], [1.5, 0.5, 1.1]], { color: hot || ctx.pathOn ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: 3, speed: 0.11 });
    /* what the model cannot see: context bubble */
    var ctxCard = K.add(new K.THREE.PlaneGeometry(0.9, 0.5), K.mat.holo(PAL.orange, 0.5), [-1.3, 1.5, 1.0], [0, 0.4, 0], { shadow: false });
    K.float(ctxCard, 0.05, 1.1);
  };
  ANCHORS.sorting = [[-1.75, 0.62, 0], [0, 1.5, 0], [1.6, 0.6, 1.15]];

  /* ================ WEEK 11: repair - move power, not just patch the tool */
  SCENES.repair = function (K, ctx) {
    K.stage({ lip: ctx.pathOn ? PAL.green : PAL.teal });
    var hot = ctx.riskOn;
    /* worktable with cracked system core */
    K.rbox(2.0, 0.1, 1.25, K.mat.plastic(0xcdb08b, 0.55), [0, 0.52, 0], null, { r: 0.04 });
    [[-0.85, -0.5], [0.85, -0.5], [-0.85, 0.5], [0.85, 0.5]].forEach(function (p) { K.cyl(0.05, 0.06, 0.52, K.mat.metal(0x8a7a64, 0.4), [p[0], 0.26, p[1]]); });
    var core = new K.THREE.Group(); ctx.root.add(core);
    K.add(new K.THREE.IcosahedronGeometry(0.4, 1), K.mat.metal(0x3b4a68, 0.3), [0, 0, 0], null, { parent: core });
    /* crack: jagged glowing seam */
    K.add(new K.THREE.TorusGeometry(0.41, 0.014, 8, 40, 2.2), K.mat.neon(hot ? PAL.red : PAL.orange, 1.2), [0, 0, 0], [0.5, 0.4, 0.9], { parent: core, shadow: false });
    core.position.set(0, 0.98, 0);
    K.spin(core, 0.25); K.float(core, 0.03, 1.0);
    K.halo(0.55, hot ? PAL.red : PAL.teal, [0, 0.62, 0], { spin: 0.5 });
    /* tool rack: patch tools vs power tools */
    var rack = new K.THREE.Group(); ctx.root.add(rack);
    K.rbox(0.1, 1.3, 1.5, K.mat.metal(0x46536e, 0.35), [0, 0.65, 0], null, { parent: rack, r: 0.04 });
    ['wrench', 'gavel', 'chair'].forEach(function (tool, tt) {
      var y = 0.98 - tt * 0.36;
      if (tool === 'wrench') {
        K.cyl(0.025, 0.025, 0.3, K.mat.metal(0xd7dee6, 0.25), [0.12, y, -0.4], [0, 0, 0.8], { parent: rack });
        K.torus(0.05, 0.02, K.mat.metal(0xd7dee6, 0.25), [0.23, y + 0.11, -0.4], null, { parent: rack });
      } else if (tool === 'gavel') {
        K.cyl(0.02, 0.02, 0.26, K.mat.plastic(0xcdb08b, 0.5), [0.12, y, 0.05], [0, 0, 0.9], { parent: rack });
        K.cyl(0.06, 0.06, 0.14, K.mat.plastic(0x9a7b52, 0.45), [0.21, y + 0.09, 0.05], [0, 0, Math.PI / 2], { parent: rack });
      } else {
        K.rbox(0.16, 0.03, 0.16, K.mat.plastic(PAL.teal, 0.4), [0.14, y - 0.02, 0.5], null, { parent: rack, r: 0.01 });
        K.box(0.16, 0.14, 0.02, K.mat.plastic(PAL.teal, 0.4), [0.14, y + 0.06, 0.57], null, { parent: rack });
      }
    });
    rack.position.set(-2.2, 0, -0.3); rack.rotation.y = 0.5;
    /* community seats around the table: who leads */
    var seats = [[-0.85, 1.35, 0x4a2f1d], [0.0, 1.6, 0x8a5a3b], [0.85, 1.35, 0xc9986a]];
    seats.forEach(function (p, si) {
      K.person({ pos: [p[0], 0, p[1]], face: 3.1, scale: 0.95, color: si === 1 ? PAL.teal : PAL.ink, tone: p[2] });
    });
    /* the power token moving from core to the community side */
    var power = K.sph(0.1, K.mat.neon(PAL.amber, 1.5), [0, 1.35, 0.2], { shadow: false });
    K.onTick(function (t) {
      var u = ctx.pathOn ? (Math.sin(t * 0.8) + 1) / 2 : 0.12;
      power.position.set(0, 1.35 - u * 0.25, 0.2 + u * 1.1);
    });
    K.flow([[0, 1.3, 0.25], [0, 1.15, 0.85], [0, 1.05, 1.35]], { color: ctx.pathOn ? PAL.amber : PAL.line, pulseColor: PAL.amber, pulses: ctx.pathOn ? 3 : 0, speed: 0.12, opacity: 0.35 });
  };
  ANCHORS.repair = [[0, 1.05, 0], [-2.2, 1.0, -0.3], [0, 0.6, 1.5]];

  /* ================== WEEK 12: policy - accountability has levels */
  SCENES.policy = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* four-layer glass strata tower */
    var layers = [
      { c: 0xe9eef2, label: 'SYSTEM', w: 2.9 },
      { c: 0x9fdde0, label: 'INSTITUTION', w: 2.45 },
      { c: 0xffcc66, label: 'LAW', w: 2.0 },
      { c: 0x8fd0ff, label: 'RIGHTS', w: 1.55 }
    ];
    layers.forEach(function (L, li) {
      var y = 0.3 + li * 0.46;
      K.rbox(L.w, 0.3, L.w * 0.62, K.mat.glass(L.c, li === 2 && hot ? 0.55 : 0.42), [0, y, 0], null, { r: 0.07 });
      var tag = K.screen(64, 14, function (g, w, h) {
        g.fillStyle = 'rgba(13,21,38,.88)'; g.fillRect(0, 0, w, h);
        g.fillStyle = li === 2 && hot ? '#ff8d80' : '#7ef0f2'; g.font = 'bold 8px monospace';
        g.fillText(L.label, w * 0.08, h * 0.74);
      }, { glow: 0.7 });
      K.add(new K.THREE.PlaneGeometry(0.86, 0.19), tag, [L.w / 2 - 0.28, y + 0.0, L.w * 0.31 + 0.012], null, { shadow: false });
    });
    /* elevator beam of accountability travelling up the stack */
    K.flow([[-0.0, 0.18, 0.0], [0, 0.75, 0], [0, 1.25, 0], [0, 1.85, 0]], { color: ctx.pathOn ? PAL.teal : PAL.line, pulseColor: PAL.teal, pulses: 3, speed: 0.1, radius: 0.02 });
    /* the gap: a broken rung in the LAW layer */
    if (true) {
      var gap = K.box(0.5, 0.045, 0.045, K.mat.neon(PAL.red, hot ? 1.4 : 0.6), [1.0, 1.22, 0.35], [0, 0.5, 0], { shadow: false });
      K.onTick(function (t) { gap.material.emissiveIntensity = (hot ? 1.2 : 0.5) + 0.3 * Math.sin(t * 3.4); });
      var exposed = K.person({ pos: [2.05, 0, 1.1], face: -0.9, scale: 0.92, color: PAL.orange, tone: 0x4a2f1d });
      void exposed;
      if (hot) K.halo(0.36, PAL.red, [2.05, 0.03, 1.1], { spin: 0.8 });
      K.flow([[1.15, 1.2, 0.4], [1.7, 0.8, 0.8], [2.05, 0.5, 1.05]], { color: hot ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: hot ? 3 : 1, speed: 0.13 });
    }
    /* gavel and rights charter as flanking exhibits */
    var gavel = new K.THREE.Group(); ctx.root.add(gavel);
    K.cyl(0.28, 0.32, 0.1, K.mat.plastic(0x9a7b52, 0.5), [0, 0.05, 0], null, { parent: gavel });
    K.cyl(0.035, 0.035, 0.5, K.mat.plastic(0xcdb08b, 0.5), [0.05, 0.32, 0], [0, 0, 0.85], { parent: gavel });
    K.cyl(0.1, 0.1, 0.26, K.mat.plastic(0xb08f66, 0.45), [0.26, 0.5, 0], [0, 0, Math.PI / 2], { parent: gavel });
    gavel.position.set(-2.3, 0.02, 0.7); gavel.rotation.y = 0.6;
    var charter = K.add(new K.THREE.PlaneGeometry(0.62, 0.82), K.screen(40, 54, function (g, w, h) {
      g.fillStyle = '#fdfbf4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1b2a4a'; g.font = 'bold 6px serif'; g.fillText('RIGHTS', w * 0.3, h * 0.16);
      g.strokeStyle = '#8ba0b4';
      for (var l2 = 0; l2 < 6; l2++) { g.beginPath(); g.moveTo(w * 0.14, h * (0.3 + l2 * 0.1)); g.lineTo(w * 0.86, h * (0.3 + l2 * 0.1)); g.stroke(); }
      g.fillStyle = '#da291c'; g.beginPath(); g.arc(w * 0.76, h * 0.86, w * 0.07, 0, 7); g.fill();
    }, { glow: 0.4 }), [-2.15, 1.15, -0.9], [0, 0.7, 0], { shadow: false });
    K.float(charter, 0.04, 1.0);
  };
  ANCHORS.policy = [[1.45, 0.3, 0], [0, 1.05, 0], [1.0, 1.25, 0.35]];

  /* ============== WEEK 13: return - the spiral back over your own map */
  SCENES['return'] = function (K, ctx) {
    K.stage({ lip: PAL.teal });
    /* ascending spiral ramp with glowing map plaques */
    var turns = 20;
    for (var i = 0; i < turns; i++) {
      var u = i / (turns - 1);
      var a = u * Math.PI * 2.1 - 0.6;
      var r = 2.35 - u * 1.15;
      var y = 0.08 + u * 1.35;
      K.rbox(0.62, 0.05, 0.34, K.mat.plastic(0xdfe7ee, 0.5), [Math.cos(a) * r, y, Math.sin(a) * r], [0, -a + Math.PI / 2, 0.0], { r: 0.02 });
    }
    /* plaques: early entry (dim) and late entry (bright) */
    function plaque(u, bright, labelTxt) {
      var a = u * Math.PI * 2.1 - 0.6;
      var r = 2.35 - u * 1.15;
      var y = 0.42 + u * 1.35;
      var mat = K.screen(36, 24, function (g, w, h) {
        g.fillStyle = bright ? '#10233f' : '#e8edf3'; g.fillRect(0, 0, w, h);
        g.fillStyle = bright ? '#7ef0f2' : '#8ba0b4'; g.font = 'bold 6px monospace';
        g.fillText(labelTxt, w * 0.1, h * 0.3);
        g.fillStyle = bright ? '#ffcc66' : '#aab8c6';
        g.fillRect(w * 0.1, h * 0.48, w * 0.8, h * 0.1);
        g.fillRect(w * 0.1, h * 0.68, w * (bright ? 0.8 : 0.45), h * 0.1);
      }, { glow: bright ? 0.75 : 0.25 });
      var p = K.add(new K.THREE.PlaneGeometry(0.58, 0.4), mat, [Math.cos(a) * r, y, Math.sin(a) * r], [0, -a + Math.PI, 0], { shadow: false });
      K.float(p, 0.03, 1.2, u * 5);
      return p;
    }
    plaque(0.08, false, 'WEEK 1');
    plaque(0.5, false, 'WEEK 6');
    plaque(0.94, true, 'WEEK 13');
    /* the climber near the top */
    K.person({ pos: [Math.cos(0.94 * Math.PI * 2.1 - 0.6) * 1.28, 1.35, Math.sin(0.94 * Math.PI * 2.1 - 0.6) * 1.28], face: 2.2, scale: 0.9, color: PAL.teal, tone: 0x8a5a3b });
    /* sightline: from the top plaque back down to week 1 */
    var a0 = 0.08 * Math.PI * 2.1 - 0.6, a1 = 0.94 * Math.PI * 2.1 - 0.6;
    K.flow([
      [Math.cos(a1) * 1.28, 1.75, Math.sin(a1) * 1.28],
      [0, 1.5, 0],
      [Math.cos(a0) * 2.26, 0.6, Math.sin(a0) * 2.26]
    ], { color: ctx.riskOn ? PAL.red : PAL.teal, pulseColor: ctx.riskOn ? PAL.red : PAL.teal, pulses: 3, speed: 0.09 });
    K.halo(0.8, PAL.teal, [0, 0.03, 0], { spin: 0.25 });
    /* growth beacon at centre */
    var beacon = K.cyl(0.05, 0.09, 1.6, K.mat.glass(PAL.tealSoft, 0.4), [0, 0.8, 0]);
    void beacon;
    K.sph(0.09, K.mat.neon(PAL.amber, 1.4), [0, 1.68, 0], { shadow: false });
  };
  ANCHORS['return'] = [[2.1, 0.65, -1.15], [0, 1.6, 0], [-0.4, 1.9, 0.75]];

  /* =============== WEEK 14: compass - the final answer points forward */
  SCENES.compass = function (K, ctx) {
    K.stage({ lip: PAL.amber });
    /* museum-floor compass rose */
    var roseMat = K.screen(96, 96, function (g, w, h) {
      g.fillStyle = '#10233f'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#37507a'; g.lineWidth = 1.4;
      g.beginPath(); g.arc(w / 2, h / 2, w * 0.44, 0, 7); g.stroke();
      g.beginPath(); g.arc(w / 2, h / 2, w * 0.3, 0, 7); g.stroke();
      g.fillStyle = '#7ef0f2';
      for (var a2 = 0; a2 < 16; a2++) {
        var an = a2 * Math.PI / 8;
        g.fillRect(w / 2 + Math.cos(an) * w * 0.38 - 1, h / 2 + Math.sin(an) * w * 0.38 - 1, 3, 3);
      }
      g.strokeStyle = '#ffcc66'; g.lineWidth = 2.2;
      g.beginPath(); g.moveTo(w / 2, h * 0.14); g.lineTo(w * 0.58, h / 2); g.lineTo(w / 2, h * 0.86); g.lineTo(w * 0.42, h / 2); g.closePath(); g.stroke();
    }, { glow: 0.55 });
    K.add(new K.THREE.CylinderGeometry(1.7, 1.78, 0.08, 64), K.own(new K.THREE.MeshStandardMaterial({ map: null, color: 0x24365c, roughness: 0.4, metalness: 0.3 })), [0, 0.04, 0]);
    K.add(new K.THREE.PlaneGeometry(2.9, 2.9), roseMat, [0, 0.095, 0], [-Math.PI / 2, 0, 0], { shadow: false });
    /* animated needle pointing forward */
    var needle = new K.THREE.Group(); ctx.root.add(needle);
    K.cone(0.09, 0.85, K.mat.neon(PAL.red, 1.0), [0, 0, -0.45], [-Math.PI / 2, 0, 0], { parent: needle });
    K.cone(0.09, 0.85, K.mat.plastic(0xd7dee6, 0.35), [0, 0, 0.45], [Math.PI / 2, 0, 0], { parent: needle });
    K.sph(0.11, K.mat.metal(0xd9b64a, 0.25), [0, 0, 0], { parent: needle });
    needle.position.set(0, 0.3, 0);
    K.onTick(function (t) { needle.rotation.y = Math.sin(t * 0.5) * 0.35 - 0.5; });
    /* four holographic petals: question, map, response, commitment */
    var petals = [
      { a: -0.5, c: PAL.teal, draw: function (g, w, h) { g.fillStyle = '#7ef0f2'; g.font = 'bold 22px serif'; g.fillText('?', w * 0.42, h * 0.62); } },
      { a: 1.07, c: PAL.amber, draw: function (g, w, h) { g.strokeStyle = '#ffcc66'; g.lineWidth = 2; g.beginPath(); g.moveTo(w * 0.2, h * 0.7); g.lineTo(w * 0.45, h * 0.35); g.lineTo(w * 0.62, h * 0.55); g.lineTo(w * 0.82, h * 0.25); g.stroke(); g.beginPath(); g.arc(w * 0.82, h * 0.25, 3, 0, 7); g.fill(); } },
      { a: 2.64, c: PAL.green, draw: function (g, w, h) { g.strokeStyle = '#79d99a'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(w * 0.28, h * 0.52); g.lineTo(w * 0.45, h * 0.7); g.lineTo(w * 0.75, h * 0.3); g.stroke(); } },
      { a: 4.21, c: PAL.orange, draw: function (g, w, h) { g.strokeStyle = '#ffb45e'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(w * 0.3, h * 0.65); g.lineTo(w * 0.62, h * 0.65); g.stroke(); g.beginPath(); g.moveTo(w * 0.52, h * 0.45); g.lineTo(w * 0.72, h * 0.65); g.lineTo(w * 0.52, h * 0.85); g.stroke(); } }
    ];
    petals.forEach(function (p, pi) {
      var x = Math.cos(p.a) * 2.15, z = Math.sin(p.a) * 2.15;
      var mat = K.screen(30, 30, function (g, w, h) {
        g.fillStyle = 'rgba(16,35,63,.92)'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#37507a'; g.strokeRect(1, 1, w - 2, h - 2);
        p.draw(g, w, h);
      }, { glow: 0.7 });
      var card = K.add(new K.THREE.PlaneGeometry(0.66, 0.66), mat, [x, 1.05, z], [0, -p.a - Math.PI / 2, 0], { shadow: false });
      K.float(card, 0.05, 1.0, pi * 0.8);
      K.cyl(0.03, 0.045, 0.65, K.mat.metal(0x9aa7b4, 0.35), [x, 0.32, z]);
      K.flow([[x * 0.92, 0.95, z * 0.92], [x * 0.5, 0.6, z * 0.5], [0, 0.35, 0]], { color: ctx.pathOn ? p.c : PAL.line, pulseColor: p.c, pulses: 2, speed: 0.08 + pi * 0.013, opacity: 0.4 });
    });
    /* the graduate stepping off the compass, forward */
    K.person({ pos: [1.1, 0, -1.75], face: -0.55, color: PAL.teal, tone: 0x8a5a3b });
    if (ctx.riskOn) K.halo(0.5, PAL.red, [0, 0.12, 0], { spin: 0.9 });
  };
  ANCHORS.compass = [[-1.5, 1.1, -1.5], [0, 0.45, 0], [1.1, 0.9, -1.75]];

  /* ==================================================== ACTIVITY MODELS === */

  /* W1 activity: startermap - make the first map entry */
  SCENES.startermap = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* desk with an open field notebook */
    K.rbox(1.9, 0.09, 1.2, K.mat.plastic(0xcdb08b, 0.55), [0, 0.5, 0.4], null, { r: 0.04 });
    [[-0.8, -0.05], [0.8, -0.05], [-0.8, 0.85], [0.8, 0.85]].forEach(function (p) { K.cyl(0.045, 0.055, 0.5, K.mat.metal(0x8a7a64, 0.4), [p[0], 0.25, p[1]]); });
    var page = K.screen(60, 40, function (g, w, h) {
      g.fillStyle = '#fdfbf4'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#c9d3dc'; for (var l = 0; l < 5; l++) { g.beginPath(); g.moveTo(w * 0.08, h * (0.3 + l * 0.14)); g.lineTo(w * 0.92, h * (0.3 + l * 0.14)); g.stroke(); }
      g.fillStyle = '#1b2a4a'; g.font = 'bold 6px sans-serif'; g.fillText('MY NOTICING MAP', w * 0.08, h * 0.16);
      g.fillStyle = '#00aeb3'; g.fillRect(w * 0.08, h * 0.26, w * 0.5, h * 0.06);
    }, { glow: 0.35 });
    K.add(new K.THREE.PlaneGeometry(1.15, 0.78), page, [0, 0.555, 0.4], [-Math.PI / 2, 0, 0], { shadow: false });
    /* step 1: the chosen tool, on a small plinth */
    K.cyl(0.24, 0.28, 0.42, K.mat.plastic(PAL.bone, 0.5), [-2.0, 0.21, -0.65]);
    var ph = K.phone([-2.0, 0.62, -0.65], [0.25, 0.5, 0]);
    K.float(ph, 0.04, 1.2);
    K.halo(0.3, hot ? PAL.red : PAL.teal, [-2.0, 0.46, -0.65], { spin: 0.6 });
    /* step 2: the assumption lens between tool and page */
    var lens = K.torus(0.4, 0.028, K.mat.metal(0xd7dee6, 0.25), [-0.85, 0.85, -0.15], [0.2, 0.5, 0]);
    K.add(new K.THREE.CircleGeometry(0.38, 40), K.mat.holo(hot ? PAL.red : PAL.teal, 0.4), [-0.85, 0.85, -0.15], [0.2, 0.5, 0], { shadow: false });
    K.spin(lens, 0.3, 'z');
    /* thread: tool through lens to the page */
    K.flow([[-2.0, 0.75, -0.65], [-0.85, 0.9, -0.15], [0, 0.62, 0.3]], { color: hot ? PAL.red : PAL.teal, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.12 });
    /* step 3: the first entry pin dropping onto the map */
    var pin = K.cone(0.07, 0.2, K.mat.neon(PAL.orange, 1.2), [0.35, 0.75, 0.55], [Math.PI, 0, 0], { shadow: false });
    K.float(pin, 0.06, 1.6);
    K.person({ pos: [1.7, 0, 1.5], face: 2.6, scale: 0.95, color: PAL.teal, tone: 0x8a5a3b });
  };
  ANCHORS.startermap = [[-2.0, 0.75, -0.65], [-0.85, 0.9, -0.15], [0.35, 0.7, 0.55]];

  /* generic match activity: matchwork - example cards into concept bins */
  SCENES.matchwork = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* example card reader on the left */
    K.rbox(1.3, 0.85, 0.14, K.mat.plastic(0x2c3852, 0.5), [-2.05, 0.72, -0.35], [0, 0.5, 0], { r: 0.06 });
    K.add(new K.THREE.PlaneGeometry(1.05, 0.6), K.screen(52, 30, function (g, w, h) {
      g.fillStyle = '#fdfbf6'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffa12b'; g.fillRect(0, 0, w * 0.06, h);
      g.fillStyle = '#1b2a4a'; g.font = 'bold 6px sans-serif'; g.fillText('EXAMPLE CARD', w * 0.12, h * 0.2);
      g.fillStyle = '#8ba0b4'; for (var l = 0; l < 3; l++) g.fillRect(w * 0.12, h * (0.38 + l * 0.18), w * 0.76, h * 0.08);
    }, { glow: 0.5 }), [-2.02, 0.74, -0.26], [0, 0.5, 0], { shadow: false });
    /* choice console in the middle */
    K.rbox(0.95, 0.5, 0.7, K.mat.metal(0x3b4a68, 0.32), [-0.2, 0.25, 0.35], null, { r: 0.05 });
    for (var b = 0; b < 3; b++) {
      var bm = K.cyl(0.09, 0.09, 0.07, K.mat.neon([PAL.teal, PAL.orange, PAL.green][b], 0.9), [-0.48 + b * 0.28, 0.54, 0.35], null, { seg: 24 });
      K.float(bm, 0.012, 2.0, b);
    }
    /* concept bins on the right, one lighting up */
    [['CRT', PAL.teal, -1.05], ['DEFAULT', PAL.orange, 0.0], ['GAZE', PAL.green, 1.05]].forEach(function (bin, bi) {
      var lit = ctx.pathOn ? bi === 1 : (hot ? bi === 2 : false);
      K.rbox(0.85, 0.62, 0.85, K.mat.glass(lit ? (hot ? 0xf3b7ae : PAL.tealSoft) : PAL.tealSoft, lit ? 0.55 : 0.32), [1.95, 0.31, bin[2]], null, { r: 0.05 });
      var tag = K.screen(30, 10, function (g, w, h) {
        g.fillStyle = 'rgba(13,21,38,.9)'; g.fillRect(0, 0, w, h);
        g.fillStyle = lit && hot ? '#ff8d80' : '#7ef0f2'; g.font = 'bold 6px monospace'; g.fillText(bin[0], w * 0.12, h * 0.72);
      }, { glow: 0.7 });
      K.add(new K.THREE.PlaneGeometry(0.6, 0.2), tag, [1.95, 0.75, bin[2]], [0, -Math.PI / 12, 0], { shadow: false });
      if (lit) K.halo(0.5, hot ? PAL.red : PAL.teal, [1.95, 0.68, bin[2]], { spin: 0.7 });
    });
    /* the card in flight along the chosen path */
    K.flow([[-1.6, 0.85, -0.3], [-0.2, 1.1, 0.15], [1.6, 0.75, ctx.pathOn ? 0.0 : -1.05]], { color: ctx.pathOn || hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.13 });
    /* feedback lamp */
    K.sph(0.1, K.mat.neon(hot ? PAL.red : PAL.green, 1.5), [2.75, 0.85, 0.0], { shadow: false });
  };
  ANCHORS.matchwork = [[-2.05, 1.05, -0.35], [-0.2, 0.62, 0.35], [1.95, 0.75, 0.0]];

  /* W2 activity: mechanismatch - case outcome through the lens to mechanism bins */
  SCENES.mechanismatch = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* case file on a reading stand */
    K.rbox(0.9, 0.06, 0.65, K.mat.plastic(0xcdb08b, 0.55), [-2.2, 0.55, -0.4], [0, 0.4, -0.18], { r: 0.03 });
    K.cyl(0.05, 0.07, 0.55, K.mat.metal(0x8a7a64, 0.4), [-2.2, 0.27, -0.4]);
    var doc = K.screen(44, 30, function (g, w, h) {
      g.fillStyle = '#fdfbf6'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#da291c'; g.font = 'bold 6px sans-serif'; g.fillText('OUTCOME: DENIED', w * 0.1, h * 0.22);
      g.fillStyle = '#8ba0b4'; for (var l = 0; l < 3; l++) g.fillRect(w * 0.1, h * (0.4 + l * 0.17), w * 0.8, h * 0.07);
    }, { glow: 0.45 });
    K.add(new K.THREE.PlaneGeometry(0.78, 0.53), doc, [-2.18, 0.6, -0.37], [-Math.PI / 2 + 0.35, 0.4, 0], { shadow: false });
    /* the outcomes lens: a standing glass ring the case passes through */
    var ringGroup = new K.THREE.Group(); ctx.root.add(ringGroup);
    K.torus(0.72, 0.045, K.mat.metal(0xd7dee6, 0.22), [0, 0, 0], null, { parent: ringGroup });
    K.add(new K.THREE.CircleGeometry(0.68, 48), K.mat.holo(hot ? PAL.red : PAL.teal, 0.42), [0, 0, 0], null, { parent: ringGroup, shadow: false });
    ringGroup.position.set(-0.45, 0.95, 0); ringGroup.rotation.y = 0.35;
    K.spin(ringGroup, 0.001, 'x');
    K.cyl(0.045, 0.06, 0.62, K.mat.metal(), [-0.45, 0.3, 0]);
    /* four mechanism bins with icons */
    var bins = [
      { t: 'RULE', c: PAL.teal, z: -1.25 }, { t: 'RECORD', c: PAL.amber, z: -0.42 },
      { t: 'DEFAULT', c: PAL.orange, z: 0.42 }, { t: 'OVERLAP', c: PAL.green, z: 1.25 }
    ];
    bins.forEach(function (bin, bi) {
      var lit = hot ? bi === 2 : (ctx.pathOn ? bi === 1 : false);
      K.rbox(0.8, lit ? 0.78 : 0.6, 0.72, lit ? K.mat.glass(hot ? 0xf3b7ae : PAL.tealSoft, 0.6) : K.mat.glass(PAL.tealSoft, 0.3), [1.85, lit ? 0.39 : 0.3, bin.z], null, { r: 0.05 });
      var tag = K.screen(34, 10, function (g, w, h) {
        g.fillStyle = 'rgba(13,21,38,.92)'; g.fillRect(0, 0, w, h);
        g.fillStyle = lit && hot ? '#ff8d80' : '#7ef0f2'; g.font = 'bold 5.6px monospace'; g.fillText(bin.t, w * 0.12, h * 0.72);
      }, { glow: 0.72 });
      K.add(new K.THREE.PlaneGeometry(0.62, 0.18), tag, [1.85, lit ? 0.92 : 0.74, bin.z], [0, -Math.PI / 14, 0], { shadow: false });
      if (lit) K.halo(0.48, hot ? PAL.red : PAL.amber, [1.85, lit ? 0.85 : 0.7, bin.z], { spin: 0.8 });
    });
    /* the case token travelling through the lens to a bin */
    var targetZ = hot ? 0.42 : (ctx.pathOn ? -0.42 : -1.25);
    K.flow([[-2.0, 0.75, -0.4], [-0.45, 1.0, 0], [0.8, 0.95, targetZ * 0.5], [1.5, 0.6, targetZ]], { color: hot || ctx.pathOn ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.11 });
    K.person({ pos: [-1.3, 0, 1.6], face: 2.5, scale: 0.92, color: PAL.teal, tone: 0x4a2f1d });
  };
  ANCHORS.mechanismatch = [[-2.2, 0.75, -0.4], [-0.45, 1.0, 0], [1.85, 0.75, 0.42]];

  /* W3 activity: decisionpath - walk one built-in decision */
  SCENES.decisionpath = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* input desk */
    K.rbox(1.0, 0.62, 0.8, K.mat.plastic(PAL.bone, 0.5), [-2.15, 0.31, 0], null, { r: 0.05 });
    var inDoc = K.screen(40, 24, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7ef0f2'; g.font = 'bold 6px monospace'; g.fillText('INPUT: FILE #204', w * 0.08, h * 0.4);
      g.fillStyle = '#ffcc66'; g.fillRect(w * 0.08, h * 0.6, w * 0.62, h * 0.14);
    }, { glow: 0.6 });
    K.add(new K.THREE.PlaneGeometry(0.8, 0.48), inDoc, [-2.15, 0.85, 0.1], [-0.35, 0, 0], { shadow: false });
    /* branching walkway: one raised decision diamond, two exits */
    var diamond = K.rbox(0.72, 0.72, 0.16, K.mat.metal(0x3b4a68, 0.3), [-0.35, 0.75, 0], [0, 0, Math.PI / 4], { r: 0.06 });
    K.spin(diamond, 0.25);
    K.halo(0.6, hot ? PAL.red : PAL.amber, [-0.35, 0.15, 0], { spin: 0.5 });
    /* green walkway and red walkway */
    K.box(2.2, 0.05, 0.62, K.mat.plastic(PAL.greenSoft, 0.55), [1.15, 0.03, -0.95], [0, 0.35, 0]);
    K.box(2.2, 0.05, 0.62, K.mat.plastic(PAL.redSoft, 0.55), [1.15, 0.03, 0.95], [0, -0.35, 0]);
    /* outcome plinths */
    K.cyl(0.3, 0.34, 0.5, K.mat.plastic(PAL.greenSoft, 0.5), [2.3, 0.25, -1.5]);
    K.person({ pos: [2.3, 0.5, -1.5], face: -1.0, scale: 0.85, color: PAL.green, tone: 0xc9986a });
    K.cyl(0.3, 0.34, 0.5, K.mat.plastic(PAL.redSoft, 0.5), [2.3, 0.25, 1.5]);
    var harmed = K.person({ pos: [2.3, 0.5, 1.5], face: -2.2, scale: 0.85, color: PAL.red, tone: 0x4a2f1d });
    harmed.rotation.z = 0.1;
    if (hot) K.halo(0.4, PAL.red, [2.3, 0.52, 1.5], { spin: 0.9 });
    /* flows from decision to outcomes */
    K.flow([[-1.6, 0.6, 0], [-0.9, 0.8, 0], [-0.35, 0.8, 0]], { color: PAL.line, pulseColor: PAL.teal, pulses: 2, speed: 0.12 });
    K.flow([[-0.05, 0.7, -0.2], [1.0, 0.5, -0.85], [2.3, 0.55, -1.5]], { color: PAL.green, pulseColor: PAL.green, pulses: 2, speed: 0.11 });
    K.flow([[-0.05, 0.7, 0.2], [1.0, 0.5, 0.85], [2.3, 0.55, 1.5]], { color: hot || ctx.pathOn ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: 3, speed: 0.13 });
  };
  ANCHORS.decisionpath = [[-2.15, 0.95, 0], [-0.35, 1.15, 0], [2.3, 0.75, 1.5]];

  /* W4 activity: defaultboard - flip the defaults, read the cost */
  SCENES.defaultboard = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* big angled switchboard */
    var board = new K.THREE.Group(); ctx.root.add(board);
    K.rbox(2.9, 1.6, 0.16, K.mat.plastic(0x2c3852, 0.5), [0, 0, 0], null, { parent: board, r: 0.08 });
    for (var r2 = 0; r2 < 2; r2++) for (var c2 = 0; c2 < 3; c2++) {
      var on = (r2 * 3 + c2) < (ctx.pathOn ? 4 : 2);
      var sx = -0.9 + c2 * 0.9, sy = 0.36 - r2 * 0.72;
      K.rbox(0.56, 0.3, 0.08, K.mat.plastic(0x1f2b45, 0.42), [sx, sy, 0.1], null, { parent: board, r: 0.04 });
      K.sph(0.085, K.mat.neon(on ? (hot ? PAL.red : PAL.orange) : PAL.teal, 1.2), [sx + (on ? 0.14 : -0.14), sy, 0.16], { parent: board, shadow: false });
    }
    board.position.set(-0.85, 1.0, -0.55); board.rotation.set(-0.28, 0.22, 0);
    K.rbox(2.5, 0.75, 0.7, K.mat.metal(0x3b4a68, 0.35), [-0.95, 0.37, 0.15], [0, 0.22, 0], { r: 0.06 });
    /* cost readout screen */
    var cost = K.add(new K.THREE.PlaneGeometry(1.15, 0.62), K.screen(56, 30, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#8ba0b4'; g.font = '6px monospace'; g.fillText('WHO ADAPTS?', w * 0.08, h * 0.26);
      g.fillStyle = '#00aeb3'; g.fillRect(w * 0.08, h * 0.4, w * 0.3, h * 0.16);
      g.fillStyle = '#da291c'; g.fillRect(w * 0.08, h * 0.66, w * 0.66, h * 0.16);
      g.fillStyle = '#e8eef4'; g.font = '5px monospace'; g.fillText('FITS', w * 0.42, h * 0.52); g.fillText('CARRIES COST', w * 0.78 - 18, h * 0.78);
    }, { glow: 0.7 }), [1.85, 1.25, -0.35], [0, -0.5, 0], { shadow: false });
    K.float(cost, 0.05, 1.0);
    /* two users: one fits the default, one adapts */
    K.person({ pos: [1.35, 0, 0.85], face: -2.6, scale: 0.95, color: PAL.teal, tone: 0xc9986a });
    var bend = K.person({ pos: [2.25, 0, 0.85], face: -2.9, scale: 0.95, color: PAL.orange, tone: 0x4a2f1d });
    bend.rotation.z = hot ? 0.18 : 0.1;
    if (hot) K.halo(0.38, PAL.red, [2.25, 0.03, 0.85], { spin: 0.8 });
    K.flow([[-0.6, 0.85, -0.2], [0.6, 0.9, 0.1], [1.8, 1.05, -0.3]], { color: ctx.pathOn || hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.14 });
  };
  ANCHORS.defaultboard = [[-0.85, 1.15, -0.55], [1.85, 1.25, -0.35], [2.25, 0.6, 0.85]];

  /* W6 activity: surveillanceflow - follow the flag, find the appeal gap */
  SCENES.surveillanceflow = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* checkpoint */
    K.archGate([-2.0, 0, 0], { w: 1.1, h: 1.5, beamColor: hot ? PAL.red : PAL.teal });
    K.person({ pos: [-2.0, 0, 0.75], face: 0, scale: 0.95, color: PAL.orange, tone: 0x4a2f1d });
    /* the scan becomes a label chip */
    var chip = new K.THREE.Group(); ctx.root.add(chip);
    K.rbox(0.5, 0.3, 0.05, K.mat.plastic(0x10233f, 0.35), [0, 0, 0], null, { parent: chip, r: 0.03 });
    var chipFace = K.screen(30, 18, function (g, w, h) {
      g.fillStyle = '#10233f'; g.fillRect(0, 0, w, h);
      g.fillStyle = hot ? '#ff8d80' : '#ffcc66'; g.font = 'bold 6px monospace'; g.fillText('FLAG: R-7', w * 0.12, h * 0.62);
    }, { glow: 0.85 });
    K.add(new K.THREE.PlaneGeometry(0.44, 0.26), chipFace, [0, 0, 0.032], null, { parent: chip, shadow: false });
    chip.position.set(-0.55, 1.2, 0.1); chip.rotation.y = -0.3;
    K.float(chip, 0.06, 1.4);
    K.halo(0.34, hot ? PAL.red : PAL.orange, [-0.55, 1.02, 0.1], { spin: 0.7 });
    /* the label travels into a second decision point */
    K.serverRack([0.85, 0, -0.85], { face: 0.35, hot: hot ? 3 : -1 });
    K.archGate([2.35, 0, 0.35], { w: 0.95, h: 1.35, beamColor: hot ? PAL.red : PAL.amber, beamSpeed: 0.9 });
    K.person({ pos: [2.35, 0, 1.05], face: 0, scale: 0.9, color: PAL.ink, tone: 0x8a5a3b });
    K.flow([[-2.0, 1.1, 0.2], [-0.55, 1.25, 0.1]], { color: hot ? PAL.red : PAL.orange, pulseColor: PAL.red, pulses: 2, speed: 0.15 });
    K.flow([[-0.55, 1.2, 0.1], [0.2, 1.15, -0.4], [0.85, 0.95, -0.85]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 2, speed: 0.12 });
    K.flow([[0.85, 0.85, -0.85], [1.6, 0.95, -0.2], [2.35, 0.85, 0.3]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.amber, pulses: 2, speed: 0.1 });
    /* the appeal desk: present but unreachable, roped off */
    K.rbox(0.95, 0.07, 0.55, K.mat.plastic(PAL.bone, 0.5), [0.4, 0.52, 1.6], [0, -0.3, 0], { r: 0.03 });
    K.cyl(0.045, 0.055, 0.52, K.mat.metal(), [0.4, 0.26, 1.6]);
    var ropeL = K.cyl(0.022, 0.022, 0.6, K.mat.metal(0xd9b64a, 0.3), [-0.25, 0.3, 1.25], null, { seg: 12 });
    var ropeR = K.cyl(0.022, 0.022, 0.6, K.mat.metal(0xd9b64a, 0.3), [1.05, 0.3, 1.25], null, { seg: 12 });
    void ropeL; void ropeR;
    K.flow([[-0.25, 0.58, 1.25], [0.4, 0.48, 1.18], [1.05, 0.58, 1.25]], { color: PAL.amber, pulses: 0, radius: 0.014, opacity: 0.8 });
    var qmark = K.add(new K.THREE.PlaneGeometry(0.4, 0.4), K.mat.holo(PAL.amber, 0.55), [0.4, 1.05, 1.6], [0, -0.3, 0], { shadow: false });
    K.float(qmark, 0.05, 1.2);
  };
  ANCHORS.surveillanceflow = [[-2.0, 1.35, 0], [-0.55, 1.25, 0.1], [0.4, 0.95, 1.6]];

  /* W7 activity: toolkit - assemble your review kit */
  SCENES.toolkit = function (K, ctx) {
    K.stage({ lip: PAL.teal });
    var hot = ctx.riskOn;
    /* workbench */
    K.rbox(2.6, 0.1, 1.3, K.mat.plastic(0xcdb08b, 0.55), [0.2, 0.52, 0.1], null, { r: 0.04 });
    [[-0.9, -0.4], [1.3, -0.4], [-0.9, 0.6], [1.3, 0.6]].forEach(function (p) { K.cyl(0.05, 0.06, 0.52, K.mat.metal(0x8a7a64, 0.4), [p[0] + 0.2, 0.26, p[1] + 0.1]); });
    /* parts tray: six week tokens */
    K.rbox(0.9, 0.06, 1.1, K.mat.plastic(0xdfe7ee, 0.5), [-0.75, 0.58, 0.1], null, { r: 0.03 });
    for (var i = 0; i < 6; i++) {
      var weak = i === 4;
      var tok = K.cyl(0.09, 0.09, 0.07, weak ? K.mat.neon(hot ? PAL.red : PAL.orange, 0.9) : K.mat.plastic(PAL.teal, 0.35), [-0.95 + (i % 2) * 0.42, 0.65, -0.3 + Math.floor(i / 2) * 0.4], null, { seg: 24 });
      if (weak) K.float(tok, 0.03, 1.8);
    }
    /* assembly zone: the kit taking shape */
    var kitBase = K.cyl(0.5, 0.56, 0.09, K.mat.metal(0x3b4a68, 0.3), [0.95, 0.61, 0.1]);
    void kitBase;
    var ringA = K.halo(0.42, PAL.teal, [0.95, 0.72, 0.1], { spin: 0.5 });
    var ringB = K.halo(0.3, PAL.amber, [0.95, 0.86, 0.1], { spin: -0.7 });
    void ringA; void ringB;
    var core2 = K.sph(0.13, K.mat.neon(hot ? PAL.red : PAL.teal, 1.2), [0.95, 0.86, 0.1], { shadow: false });
    K.float(core2, 0.04, 1.3);
    /* strengthened piece slot */
    var noteMat = K.screen(40, 22, function (g, w, h) {
      g.fillStyle = '#fdfbf4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1c7a43'; g.font = 'bold 5.4px sans-serif'; g.fillText('NOW I CAN SAY...', w * 0.08, h * 0.3);
      g.fillStyle = '#8ba0b4'; g.fillRect(w * 0.08, h * 0.5, w * 0.84, h * 0.1); g.fillRect(w * 0.08, h * 0.7, w * 0.6, h * 0.1);
    }, { glow: 0.4 });
    K.add(new K.THREE.PlaneGeometry(0.8, 0.44), noteMat, [2.2, 0.95, 0.7], [0, -0.6, 0], { shadow: false });
    K.cyl(0.035, 0.05, 0.72, K.mat.metal(), [2.2, 0.36, 0.7]);
    K.flow([[-0.75, 0.68, 0.1], [0.2, 0.9, 0.1], [0.95, 0.8, 0.1]], { color: ctx.pathOn ? PAL.teal : PAL.line, pulseColor: PAL.teal, pulses: 3, speed: 0.12 });
    K.flow([[0.95, 0.85, 0.1], [1.6, 1.0, 0.4], [2.2, 0.95, 0.68]], { color: ctx.pathOn ? PAL.green : PAL.line, pulseColor: PAL.green, pulses: 2, speed: 0.1 });
    K.person({ pos: [0.1, 0, 1.75], face: 3.0, scale: 0.95, color: PAL.teal, tone: 0x8a5a3b });
  };
  ANCHORS.toolkit = [[-0.75, 0.72, 0.1], [0.95, 0.95, 0.1], [2.2, 1.0, 0.7]];

  /* W8 activity: datastory - open the data story, return the key */
  SCENES.datastory = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* the record: a data slab on a plinth */
    K.cyl(0.3, 0.34, 0.5, K.mat.plastic(PAL.bone, 0.5), [-1.9, 0.25, -0.3]);
    var slab = K.rbox(0.62, 0.82, 0.09, K.mat.metal(0x33415c, 0.3), [-1.9, 0.95, -0.3], [0, 0.45, 0], { r: 0.05 });
    K.float(slab, 0.04, 1.0);
    var slabFace = K.screen(30, 40, function (g, w, h) {
      g.fillStyle = '#10233f'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#7ef0f2'; g.font = 'bold 5px monospace'; g.fillText('RECORD 0x2F', w * 0.1, h * 0.14);
      g.fillStyle = '#8ba0b4';
      for (var l = 0; l < 6; l++) g.fillRect(w * 0.1, h * (0.24 + l * 0.11), w * (0.3 + (l % 3) * 0.2), h * 0.05);
    }, { glow: 0.7 });
    K.add(new K.THREE.PlaneGeometry(0.52, 0.72), slabFace, [-1.855, 0.95, -0.245], [0, 0.45, 0], { shadow: false });
    /* the story it projects about people */
    var projMat = K.mat.holo(hot ? PAL.red : PAL.teal, 0.35);
    K.add(new K.THREE.ConeGeometry(0.9, 1.5, 4, 1, true), projMat, [-0.35, 1.15, -0.1], [0, Math.PI / 4, -Math.PI / 2], { shadow: false });
    var story = K.screen(52, 34, function (g, w, h) {
      g.fillStyle = 'rgba(16,35,63,.94)'; g.fillRect(0, 0, w, h);
      g.fillStyle = hot ? '#ff8d80' : '#7ef0f2'; g.font = 'bold 4.7px sans-serif';
      g.fillText(hot ? '"COMMUNITY PROGRAMS: HIGH RISK"' : '"COMMUNITY PROGRAMS"', w * 0.08, h * 0.24, w * 0.84);
      g.strokeStyle = '#37507a'; g.strokeRect(w * 0.08, h * 0.36, w * 0.36, h * 0.5);
      g.beginPath(); g.arc(w * 0.26, h * 0.52, w * 0.06, 0, 7); g.stroke();
      g.fillStyle = '#8ba0b4'; g.fillRect(w * 0.52, h * 0.42, w * 0.4, h * 0.08); g.fillRect(w * 0.52, h * 0.58, w * 0.4, h * 0.08); g.fillRect(w * 0.52, h * 0.74, w * 0.28, h * 0.08);
    }, { glow: 0.8 });
    var storyCard = K.add(new K.THREE.PlaneGeometry(1.35, 0.9), story, [0.55, 1.15, -0.05], [0, -0.15, 0], { shadow: false });
    K.float(storyCard, 0.05, 0.9);
    /* the people the story is about, watching it */
    [[0.15, 1.35, 0x4a2f1d], [0.85, 1.55, 0x8a5a3b]].forEach(function (p, pi) {
      K.person({ pos: [p[0], 0, p[1]], face: 3.1 - pi * 0.2, scale: 0.92, color: pi ? PAL.ink : PAL.teal, tone: p[2] });
    });
    /* the governance key: correction console on the community side */
    K.rbox(0.85, 0.5, 0.6, K.mat.metal(0x3b4a68, 0.32), [2.2, 0.25, 0.45], [0, -0.5, 0], { r: 0.05 });
    var key2 = new K.THREE.Group(); ctx.root.add(key2);
    K.torus(0.08, 0.026, K.mat.metal(0xd9b64a, 0.25), [0, 0.12, 0], null, { parent: key2 });
    K.cyl(0.024, 0.024, 0.26, K.mat.metal(0xd9b64a, 0.25), [0, -0.06, 0], null, { parent: key2 });
    K.box(0.08, 0.03, 0.024, K.mat.metal(0xd9b64a, 0.25), [0.04, -0.16, 0], null, { parent: key2 });
    key2.position.set(2.2, 0.75, 0.45);
    K.spin(key2, 0.6); K.float(key2, 0.05, 1.4);
    K.halo(0.28, ctx.pathOn ? PAL.green : PAL.amber, [2.2, 0.62, 0.45], { spin: 0.7 });
    /* correction line back into the record */
    K.flow([[2.2, 0.7, 0.45], [0.6, 1.5, 0.4], [-1.75, 1.05, -0.25]], { color: ctx.pathOn ? PAL.green : PAL.line, pulseColor: PAL.green, pulses: ctx.pathOn ? 3 : 1, speed: 0.1 });
  };
  ANCHORS.datastory = [[-1.9, 1.15, -0.3], [0.55, 1.3, -0.05], [2.2, 0.85, 0.45]];

  /* W9 activity: promisefunnel - x-ray the helpful promise */
  SCENES.promisefunnel = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* the promise sign */
    var sign = K.add(new K.THREE.PlaneGeometry(1.3, 0.7), K.screen(52, 28, function (g, w, h) {
      g.fillStyle = '#eafefe'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#00aeb3'; g.font = 'bold 8px sans-serif'; g.fillText('FREE SUPPORT', w * 0.14, h * 0.4);
      g.font = '5px sans-serif'; g.fillText('we are here to help', w * 0.2, h * 0.62);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 2; g.beginPath(); g.arc(w * 0.5, h * 0.84, w * 0.05, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    }, { glow: 0.75 }), [-2.0, 1.35, -0.2], [0, 0.5, 0], { shadow: false });
    K.float(sign, 0.05, 1.0);
    K.cyl(0.04, 0.055, 1.0, K.mat.metal(), [-2.0, 0.5, -0.2]);
    K.person({ pos: [-1.55, 0, 0.9], face: 2.6, scale: 0.95, color: PAL.teal, tone: 0xc9986a });
    /* x-ray funnel: glass shell with visible inner workings */
    var xr = new K.THREE.Group(); ctx.root.add(xr);
    K.add(new K.THREE.CylinderGeometry(0.85, 0.14, 1.05, 40, 1, true), K.mat.glass(hot ? 0xf3b7ae : PAL.tealSoft, 0.35), [0, 0.85, 0], null, { parent: xr });
    /* inner gears */
    var gearA = K.torus(0.34, 0.05, K.mat.metal(0x9aa7b4, 0.3), [0, 0.95, 0], [Math.PI / 2, 0, 0], { parent: xr });
    var gearB = K.torus(0.2, 0.04, K.mat.metal(0xd7dee6, 0.3), [0, 0.68, 0], [Math.PI / 2, 0, 0], { parent: xr });
    K.spin(gearA, 0.7, 'z'); K.spin(gearB, -1.0, 'z');
    K.cyl(0.1, 0.13, 0.3, K.mat.plastic(0x101a2e, 0.35), [0, 0.15, 0], null, { parent: xr });
    xr.position.set(0.4, 0, -0.2);
    /* droplets: what it collects */
    var drops2 = [];
    for (var d2 = 0; d2 < 5; d2++) drops2.push(K.sph(0.04, K.mat.neon(hot ? PAL.red : PAL.orange, 1.3), [0.4, 1.3, -0.2], { shadow: false }));
    K.onTick(function (t) {
      drops2.forEach(function (dr, di) {
        var u = ((t * 0.35) + di / 5) % 1;
        var rr = 0.7 * (1 - u * 0.9);
        var aa = di * 1.26 + t * 0.8;
        dr.position.set(0.4 + Math.cos(aa) * rr, 1.35 - u * 1.0, -0.2 + Math.sin(aa) * rr);
      });
    });
    K.flow([[-1.55, 0.6, 0.85], [-0.6, 0.9, 0.3], [0.4, 1.3, -0.2]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.orange, pulses: 3, speed: 0.13 });
    /* the power meter: who gains, who is exposed */
    var meter = K.add(new K.THREE.PlaneGeometry(1.05, 0.6), K.screen(52, 30, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#8ba0b4'; g.font = '5px monospace'; g.fillText('PROVIDER GAINS', w * 0.08, h * 0.28);
      g.fillStyle = '#1c7a43'; g.fillRect(w * 0.08, h * 0.34, w * 0.78, h * 0.14);
      g.fillStyle = '#8ba0b4'; g.fillText('USER EXPOSED', w * 0.08, h * 0.68);
      g.fillStyle = '#da291c'; g.fillRect(w * 0.08, h * 0.74, w * (hot ? 0.72 : 0.4), h * 0.14);
    }, { glow: 0.72 }), [2.15, 1.05, 0.45], [0, -0.55, 0], { shadow: false });
    K.float(meter, 0.05, 1.1);
    K.cyl(0.035, 0.05, 0.7, K.mat.metal(), [2.15, 0.35, 0.45]);
    K.flow([[0.55, 0.35, -0.15], [1.4, 0.55, 0.15], [2.15, 0.75, 0.42]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 2, speed: 0.11 });
  };
  ANCHORS.promisefunnel = [[-2.0, 1.55, -0.2], [0.4, 1.0, -0.2], [2.15, 1.15, 0.45]];

  /* W9 activity: detector - who gets accused of AI writing */
  SCENES.detector = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    var essays = [
      ['A. OSEI', 'human written', 'English learned 3rd'],
      ['J. MILLER', 'AI-assisted draft', 'native speaker'],
      ['T. NGUYEN', 'human written', 'bilingual writer']
    ];
    /* Side-mounted evidence rack: the support stays behind the cards so no
       structural element can cover the student names or writing profiles. */
    var essayY = [1.78, 1.08, 0.38];
    essays.forEach(function (es, ei) {
      var pn = K.add(new K.THREE.PlaneGeometry(1.0, 0.62), K.screen(56, 34, function (g, w, h) {
        g.fillStyle = '#fdfdfb'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#1b2a4a'; g.font = 'bold ' + Math.round(w * 0.105) + 'px sans-serif'; g.fillText(es[0], w * 0.07, h * 0.26);
        g.fillStyle = '#33456b'; g.font = Math.round(w * 0.072) + 'px sans-serif';
        g.fillText(es[1], w * 0.07, h * 0.46);
        g.fillText(es[2], w * 0.07, h * 0.62);
        g.strokeStyle = '#b9c4cf'; g.lineWidth = Math.max(2, w * 0.006);
        for (var li = 0; li < 3; li++) { g.beginPath(); g.moveTo(w * 0.07, h * (0.74 + li * 0.09)); g.lineTo(w * 0.9, h * (0.74 + li * 0.09)); g.stroke(); }
      }, { glow: 0.34 }), [-2.08, essayY[ei], 0.18], [0, 0.42, 0], { shadow: false });
      K.float(pn, 0.03, 0.9 + ei * 0.15);
      K.flow([[-1.58, essayY[ei], 0.16], [-0.7, 1.0, 0], [0.12, 0.9, -0.1]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 2, speed: 0.1 + ei * 0.02 });
    });
    K.cyl(0.04, 0.055, 1.75, K.mat.metal(), [-2.78, 0.88, -0.18]);
    essayY.forEach(function (y) {
      K.box(0.52, 0.025, 0.025, K.mat.metal(), [-2.52, y, -0.16]);
    });
    K.archGate([0.12, 0, -0.1], { w: 1.5, h: 1.85, light: hot ? PAL.red : PAL.teal, beamColor: hot ? PAL.red : PAL.teal, beamSpeed: 1.5 });
    var badge = K.add(new K.THREE.PlaneGeometry(0.9, 0.3), K.screen(52, 18, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#9fdde0'; g.font = 'bold ' + Math.round(w * 0.095) + 'px monospace'; g.fillText('AI DETECTOR', w * 0.14, h * 0.44);
      g.fillStyle = '#8ba0b4'; g.font = Math.round(w * 0.062) + 'px monospace'; g.fillText('"near-perfect accuracy"', w * 0.1, h * 0.8);
    }, { glow: 0.8 }), [0.12, 2.12, -0.1], null, { shadow: false });
    K.float(badge, 0.03, 1.1);
    var board = K.add(new K.THREE.PlaneGeometry(1.35, 0.95), K.screen(60, 42, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#8ba0b4'; g.font = 'bold ' + Math.round(w * 0.065) + 'px monospace'; g.fillText('VERDICTS', w * 0.07, h * 0.15);
      var rows = hot
        ? [['OSEI', '#da291c', 'FLAGGED'], ['MILLER', '#1c7a43', 'PASS'], ['NGUYEN', '#da291c', 'FLAGGED']]
        : [['OSEI', '#8ba0b4', '?'], ['MILLER', '#8ba0b4', '?'], ['NGUYEN', '#8ba0b4', '?']];
      rows.forEach(function (r, ri) {
        var y = h * (0.3 + ri * 0.2);
        g.fillStyle = '#d7dee6'; g.font = Math.round(w * 0.075) + 'px monospace'; g.fillText(r[0], w * 0.07, y);
        g.fillStyle = r[1]; g.font = 'bold ' + Math.round(w * 0.075) + 'px monospace'; g.fillText(r[2], w * 0.52, y);
      });
      if (hot) { g.fillStyle = '#ffa12b'; g.font = Math.round(w * 0.052) + 'px monospace'; g.fillText('61% of non-native essays flagged', w * 0.07, h * 0.93); }
    }, { glow: 0.75 }), [2.25, 1.15, 0.35], [0, -0.55, 0], { shadow: false });
    K.float(board, 0.04, 1.0);
    K.cyl(0.035, 0.05, 0.75, K.mat.metal(), [2.25, 0.38, 0.35]);
    K.flow([[0.55, 0.9, -0.1], [1.4, 1.0, 0.1], [2.25, 1.05, 0.32]], { color: hot ? PAL.red : PAL.line, pulseColor: hot ? PAL.red : PAL.orange, pulses: 3, speed: 0.12 });
    K.person({ pos: [1.5, 0, 1.35], face: -2.6, scale: 0.95, color: PAL.ink });
  };
  ANCHORS.detector = [[-2.15, 2.0, 0.1], [0.12, 1.9, -0.1], [2.25, 1.6, 0.35]];

  /* W10 activity: thresholdaudit - test the cutoff, add human review */
  SCENES.thresholdaudit = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* score dial */
    var dial = new K.THREE.Group(); ctx.root.add(dial);
    K.cyl(0.62, 0.66, 0.12, K.mat.metal(0x3b4a68, 0.3), [0, 0, 0], null, { parent: dial });
    var dialFace = K.screen(48, 48, function (g, w, h) {
      g.fillStyle = '#10233f'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.46, 0, 7); g.fill();
      g.strokeStyle = '#37507a'; g.lineWidth = 2;
      for (var a3 = 0; a3 < 10; a3++) {
        var an = Math.PI * (0.75 + a3 * 0.17);
        g.beginPath(); g.moveTo(w / 2 + Math.cos(an) * w * 0.34, h / 2 + Math.sin(an) * w * 0.34); g.lineTo(w / 2 + Math.cos(an) * w * 0.42, h / 2 + Math.sin(an) * w * 0.42); g.stroke();
      }
      g.strokeStyle = '#ffcc66'; g.lineWidth = 3;
      g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w * 0.72, h * 0.3); g.stroke();
      g.fillStyle = '#ffcc66'; g.font = 'bold 6px monospace'; g.fillText('71', w * 0.44, h * 0.6);
    }, { glow: 0.75 });
    K.add(new K.THREE.PlaneGeometry(1.0, 1.0), dialFace, [0, 0, 0.07], null, { parent: dial, shadow: false });
    dial.position.set(-1.95, 1.05, -0.25); dial.rotation.y = 0.4;
    K.cyl(0.05, 0.07, 0.6, K.mat.metal(), [-1.95, 0.3, -0.25]);
    /* cutoff slider gate */
    var slider = new K.THREE.Group(); ctx.root.add(slider);
    K.rbox(0.14, 1.3, 0.7, K.mat.metal(0x33415c, 0.3), [0, 0.65, -0.55], null, { parent: slider, r: 0.05 });
    K.rbox(0.14, 1.3, 0.7, K.mat.metal(0x33415c, 0.3), [0, 0.65, 0.55], null, { parent: slider, r: 0.05 });
    var bar = K.box(0.05, 0.05, 1.15, K.mat.neon(hot ? PAL.red : PAL.amber, 1.4), [0, 0.62, 0], null, { parent: slider, shadow: false });
    K.onTick(function (t) { bar.position.y = 0.62 + (ctx.pathOn ? Math.sin(t * 0.9) * 0.18 : 0); });
    slider.position.set(0.15, 0, 0);
    /* two doors: support vs waiting */
    K.rbox(0.75, 1.25, 0.1, K.mat.plastic(PAL.greenSoft, 0.45), [1.8, 0.62, -0.95], [0, -0.3, 0], { r: 0.05 });
    K.rbox(0.75, 1.25, 0.1, K.mat.plastic(PAL.redSoft, 0.45), [1.8, 0.62, 0.95], [0, 0.3, 0], { r: 0.05 });
    K.person({ pos: [2.45, 0, -1.25], face: -2.6, scale: 0.9, color: PAL.green, tone: 0xc9986a });
    var edgeCase = K.person({ pos: [1.15, 0, 1.35], face: -0.4, scale: 0.9, color: PAL.orange, tone: 0x4a2f1d });
    void edgeCase;
    K.halo(0.36, hot ? PAL.red : PAL.orange, [1.15, 0.03, 1.35], { spin: 0.8 });
    K.flow([[-1.5, 0.85, -0.2], [-0.6, 0.8, -0.1], [0.1, 0.7, 0]], { color: PAL.line, pulseColor: PAL.teal, pulses: 2, speed: 0.12 });
    K.flow([[0.3, 0.75, -0.15], [1.0, 0.7, -0.6], [1.75, 0.62, -0.95]], { color: PAL.green, pulseColor: PAL.green, pulses: 2, speed: 0.11 });
    K.flow([[0.3, 0.6, 0.15], [0.8, 0.5, 0.8], [1.15, 0.4, 1.3]], { color: hot ? PAL.red : PAL.line, pulseColor: PAL.red, pulses: 2, speed: 0.12 });
    /* human review magnifier over the edge case */
    var mag = new K.THREE.Group(); ctx.root.add(mag);
    K.torus(0.2, 0.03, K.mat.metal(0xd9b64a, 0.25), [0, 0, 0], null, { parent: mag });
    K.add(new K.THREE.CircleGeometry(0.18, 32), K.mat.glass(0xffffff, 0.25), [0, 0, 0], null, { parent: mag, shadow: false });
    K.cyl(0.026, 0.026, 0.3, K.mat.metal(0xd9b64a, 0.25), [0.24, -0.24, 0], [0, 0, -0.8], { parent: mag });
    mag.position.set(1.15, 1.2, 1.35); mag.rotation.x = 0.4;
    K.float(mag, 0.06, 1.2);
  };
  ANCHORS.thresholdaudit = [[-1.95, 1.35, -0.25], [0.15, 1.25, 0], [1.15, 1.25, 1.35]];

  /* W11 activity: repairtable - does the fix move power? */
  SCENES.repairtable = function (K, ctx) {
    K.stage({ lip: ctx.pathOn ? PAL.green : PAL.teal });
    var hot = ctx.riskOn;
    /* round table, harm at centre */
    K.cyl(1.15, 1.22, 0.1, K.mat.plastic(0xcdb08b, 0.55), [0, 0.5, 0]);
    K.cyl(0.12, 0.16, 0.5, K.mat.metal(0x8a7a64, 0.4), [0, 0.25, 0]);
    var harm = new K.THREE.Group(); ctx.root.add(harm);
    K.add(new K.THREE.OctahedronGeometry(0.26, 0), K.mat.metal(0x46536e, 0.3), [0, 0, 0], null, { parent: harm });
    K.add(new K.THREE.TorusGeometry(0.28, 0.012, 8, 40, 2.6), K.mat.neon(hot ? PAL.red : PAL.orange, 1.2), [0, 0, 0], [0.6, 0.2, 0.6], { parent: harm, shadow: false });
    harm.position.set(0, 0.82, 0);
    K.spin(harm, 0.3); K.float(harm, 0.025, 1.1);
    /* two response trays: PATCH vs REPAIR */
    var patchTag = K.screen(36, 12, function (g, w, h) {
      g.fillStyle = 'rgba(13,21,38,.9)'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffcc66'; g.font = 'bold 6px monospace'; g.fillText('PATCH', w * 0.24, h * 0.72);
    }, { glow: 0.7 });
    var repairTag = K.screen(36, 12, function (g, w, h) {
      g.fillStyle = 'rgba(13,21,38,.9)'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#79d99a'; g.font = 'bold 6px monospace'; g.fillText('REPAIR', w * 0.2, h * 0.72);
    }, { glow: 0.7 });
    /* patch side: tape + same hands keep deciding */
    K.rbox(0.95, 0.06, 0.7, K.mat.plastic(0xdfe7ee, 0.5), [-1.65, 0.58, -0.75], [0, 0.45, 0], { r: 0.03 });
    K.add(new K.THREE.PlaneGeometry(0.66, 0.22), patchTag, [-1.65, 0.95, -0.75], [0, 0.45, 0], { shadow: false });
    K.box(0.4, 0.03, 0.12, K.mat.plastic(0xd9d2be, 0.5), [-1.72, 0.63, -0.72], [0, 0.8, 0]);
    K.box(0.4, 0.03, 0.12, K.mat.plastic(0xd9d2be, 0.5), [-1.58, 0.63, -0.8], [0, 0.2, 0]);
    /* repair side: a new seat and the power token */
    K.rbox(0.95, 0.06, 0.7, K.mat.plastic(0xdfe7ee, 0.5), [-1.55, 0.58, 0.95], [0, -0.5, 0], { r: 0.03 });
    K.add(new K.THREE.PlaneGeometry(0.66, 0.22), repairTag, [-1.55, 0.95, 0.95], [0, -0.5, 0], { shadow: false });
    K.rbox(0.2, 0.04, 0.2, K.mat.plastic(PAL.teal, 0.4), [-1.6, 0.63, 0.95], null, { r: 0.01 });
    K.box(0.2, 0.18, 0.03, K.mat.plastic(PAL.teal, 0.4), [-1.6, 0.74, 1.04]);
    /* the seats: who is at the table */
    var seatAngles = [0.5, 1.35, 2.2, 3.05, 4.2, 5.1];
    seatAngles.forEach(function (a4, si) {
      var sx = Math.cos(a4) * 1.75, sz = Math.sin(a4) * 1.75;
      var occupied = si < (ctx.pathOn ? 5 : 3);
      if (occupied) K.person({ pos: [sx, 0, sz], face: a4 + Math.PI, scale: 0.9, color: si % 2 ? PAL.teal : PAL.ink, tone: [0x4a2f1d, 0x8a5a3b, 0xc9986a][si % 3] });
      else {
        K.rbox(0.3, 0.05, 0.3, K.mat.plastic(0xd8dee6, 0.5), [sx, 0.3, sz], [0, -a4, 0], { r: 0.02 });
        K.cyl(0.03, 0.04, 0.3, K.mat.metal(), [sx, 0.15, sz]);
      }
    });
    /* power token slides toward the community when path is on */
    var power2 = K.sph(0.09, K.mat.neon(PAL.amber, 1.5), [0, 1.15, 0], { shadow: false });
    K.onTick(function (t) {
      var u = ctx.pathOn ? (Math.sin(t * 0.7) + 1) / 2 : 0.1;
      power2.position.set(Math.cos(2.2) * u * 1.45, 1.15 - u * 0.35, Math.sin(2.2) * u * 1.45);
    });
    if (hot) K.halo(0.5, PAL.red, [0, 0.56, 0], { spin: 0.8 });
  };
  ANCHORS.repairtable = [[0, 0.95, 0], [-1.65, 1.0, -0.75], [-1.55, 1.0, 0.95]];

  /* W12 activity: policydeck - compare the levers */
  SCENES.policydeck = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* low strata plinth (echo of the overview, compressed) */
    ['SYSTEM', 'INSTITUTION', 'LAW', 'RIGHTS'].forEach(function (nm, li) {
      K.rbox(2.5 - li * 0.35, 0.16, 1.4 - li * 0.18, K.mat.glass([0xe9eef2, 0x9fdde0, 0xffcc66, 0x8fd0ff][li], 0.35), [-0.6, 0.12 + li * 0.2, 0], null, { r: 0.05 });
    });
    /* four floating lever cards above the strata */
    var levers = [
      { t: 'AUDIT', c: PAL.teal, x: -1.9 }, { t: 'BAN', c: PAL.red, x: -0.9 },
      { t: 'LAW', c: PAL.amber, x: 0.1 }, { t: 'RIGHTS', c: 0x8fd0ff, x: 1.1 }
    ];
    levers.forEach(function (lv, li) {
      var chosen = ctx.pathOn ? (li === 1 || li === 2) : (hot ? li === 2 : false);
      var mat = K.screen(30, 20, function (g, w, h) {
        g.fillStyle = chosen ? 'rgba(28,52,90,.96)' : 'rgba(16,35,63,.9)'; g.fillRect(0, 0, w, h);
        g.strokeStyle = chosen ? '#ffcc66' : '#37507a'; g.lineWidth = 1.6; g.strokeRect(1, 1, w - 2, h - 2);
        g.fillStyle = '#e8eef4'; g.font = 'bold 5.6px monospace'; g.fillText(lv.t, w * 0.14, h * 0.4);
        g.fillStyle = '#79d99a'; g.fillRect(w * 0.14, h * 0.56, w * 0.5, h * 0.1);
        g.fillStyle = '#ff8d80'; g.fillRect(w * 0.14, h * 0.74, w * 0.36, h * 0.1);
      }, { glow: chosen ? 0.85 : 0.5 });
      var card = K.add(new K.THREE.PlaneGeometry(0.72, 0.48), mat, [lv.x, 1.55 + (chosen ? 0.12 : 0), 0.35], [0, -0.12, 0], { shadow: false });
      K.float(card, 0.05, 1.0, li * 0.7);
      K.flow([[lv.x, 1.3, 0.35], [lv.x * 0.7 - 0.2, 0.8, 0.2], [-0.6, 0.2 + (li === 3 ? 0.72 : li * 0.2), 0]], { color: chosen ? lv.c : PAL.line, pulseColor: lv.c, pulses: chosen ? 2 : 0, speed: 0.1, opacity: 0.4 });
    });
    /* trade-off scale on the right */
    K.cyl(0.04, 0.05, 1.2, K.mat.metal(), [2.3, 0.6, -0.2]);
    var beam2 = new K.THREE.Group(); ctx.root.add(beam2);
    K.box(1.15, 0.035, 0.07, K.mat.metal(0xd7dee6, 0.3), [0, 0, 0], null, { parent: beam2 });
    K.sph(0.09, K.mat.neon(PAL.green, 1.0), [-0.5, -0.1, 0], { parent: beam2, shadow: false });
    K.sph(0.11, K.mat.neon(hot ? PAL.red : PAL.orange, 1.0), [0.52, -0.14, 0], { parent: beam2, shadow: false });
    beam2.position.set(2.3, 1.22, -0.2);
    K.onTick(function (t) { beam2.rotation.z = -0.14 + Math.sin(t * 0.8) * (ctx.pathOn ? 0.12 : 0.04); });
    /* the gap that remains: red shimmer beside the stack */
    var gap2 = K.add(new K.THREE.PlaneGeometry(0.5, 0.8), K.mat.holo(PAL.red, hot ? 0.6 : 0.3), [0.9, 0.5, -0.75], [0, 0.5, 0], { shadow: false });
    K.float(gap2, 0.04, 1.4);
  };
  ANCHORS.policydeck = [[-1.9, 1.7, 0.35], [-0.6, 0.5, 0], [2.3, 1.3, -0.2]];

  /* W13 activity: capstonemap - two entries, one change, the final plan */
  SCENES.capstonemap = function (K, ctx) {
    K.stage({ lip: PAL.amber });
    var hot = ctx.riskOn;
    /* early entry lectern and late entry lectern */
    function lectern(x, z, face, bright, header) {
      K.rbox(0.16, 1.0, 0.5, K.mat.metal(0x3b4a68, 0.32), [x, 0.5, z], [0, face, 0], { r: 0.05 });
      var mat = K.screen(40, 28, function (g, w, h) {
        g.fillStyle = bright ? '#10233f' : '#f2f0e8'; g.fillRect(0, 0, w, h);
        g.fillStyle = bright ? '#7ef0f2' : '#8ba0b4'; g.font = 'bold 5px monospace'; g.fillText(header, w * 0.08, h * 0.2);
        g.fillStyle = bright ? '#ffcc66' : '#aab8c6';
        g.fillRect(w * 0.08, h * 0.36, w * 0.84, h * 0.09);
        g.fillRect(w * 0.08, h * 0.54, w * (bright ? 0.84 : 0.5), h * 0.09);
        g.fillRect(w * 0.08, h * 0.72, w * (bright ? 0.7 : 0.3), h * 0.09);
      }, { glow: bright ? 0.8 : 0.3 });
      var pl = K.add(new K.THREE.PlaneGeometry(0.85, 0.6), mat, [x + Math.sin(face) * 0.14, 1.15, z + Math.cos(face) * 0.14], [0, face, 0], { shadow: false });
      K.float(pl, 0.035, 1.1, x);
      return pl;
    }
    lectern(-1.85, -0.55, 0.5, false, 'WEEK 1 ENTRY');
    lectern(-1.55, 1.05, -0.4, true, 'WEEK 12 ENTRY');
    /* the change marker between them */
    var delta = new K.THREE.Group(); ctx.root.add(delta);
    K.add(new K.THREE.TetrahedronGeometry(0.24, 0), K.mat.neon(hot ? PAL.red : PAL.amber, 1.2), [0, 0, 0], null, { parent: delta });
    delta.position.set(-1.15, 1.35, 0.25);
    K.spin(delta, 0.8); K.float(delta, 0.06, 1.3);
    K.flow([[-1.75, 1.15, -0.5], [-1.15, 1.35, 0.25], [-1.5, 1.15, 1.0]], { color: hot ? PAL.red : PAL.teal, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.12 });
    /* the final plan drafting table */
    K.rbox(1.7, 0.08, 1.1, K.mat.plastic(0xcdb08b, 0.55), [1.45, 0.55, 0.15], [0, -0.25, 0], { r: 0.04 });
    [[0.75, -0.3], [2.15, -0.3], [0.75, 0.6], [2.15, 0.6]].forEach(function (p) { K.cyl(0.045, 0.055, 0.55, K.mat.metal(0x8a7a64, 0.4), [p[0], 0.27, p[1] + 0.15]); });
    var plan = K.screen(56, 36, function (g, w, h) {
      g.fillStyle = '#fdfbf4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1b2a4a'; g.font = 'bold 5.4px sans-serif'; g.fillText('FINAL RESPONSE PLAN', w * 0.08, h * 0.16);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(w * 0.14, h * 0.66); g.lineTo(w * 0.34, h * 0.4); g.lineTo(w * 0.56, h * 0.56); g.lineTo(w * 0.82, h * 0.3); g.stroke();
      g.fillStyle = '#da291c'; g.beginPath(); g.arc(w * 0.82, h * 0.3, 2.6, 0, 7); g.fill();
      g.fillStyle = '#8ba0b4'; g.fillRect(w * 0.08, h * 0.78, w * 0.6, h * 0.08);
    }, { glow: 0.45 });
    K.add(new K.THREE.PlaneGeometry(1.15, 0.74), plan, [1.45, 0.6, 0.15], [-Math.PI / 2, 0, -0.25], { shadow: false });
    K.person({ pos: [1.7, 0, 1.45], face: 2.8, scale: 0.95, color: PAL.teal, tone: 0x8a5a3b });
    K.flow([[-1.15, 1.3, 0.3], [0.2, 1.1, 0.3], [1.35, 0.68, 0.2]], { color: ctx.pathOn ? PAL.amber : PAL.line, pulseColor: PAL.amber, pulses: 2, speed: 0.1 });
  };
  ANCHORS.capstonemap = [[-1.85, 1.25, -0.55], [-1.15, 1.4, 0.25], [1.45, 0.7, 0.15]];

  /* W14 activity: futurecompass - carry the answer forward */
  SCENES.futurecompass = function (K, ctx) {
    K.stage({ lip: PAL.amber });
    var hot = ctx.riskOn;
    /* hand-held compass on a desk stand */
    var comp = new K.THREE.Group(); ctx.root.add(comp);
    K.cyl(0.55, 0.6, 0.14, K.mat.metal(0xd9b64a, 0.25), [0, 0, 0], null, { parent: comp });
    var face2 = K.screen(48, 48, function (g, w, h) {
      g.fillStyle = '#fdfbf2'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.44, 0, 7); g.fill();
      g.strokeStyle = '#8ba0b4'; g.lineWidth = 1.4; g.beginPath(); g.arc(w / 2, h / 2, w * 0.38, 0, 7); g.stroke();
      g.fillStyle = '#1b2a4a'; g.font = 'bold 6px serif';
      g.fillText('N', w * 0.47, h * 0.2); g.fillText('S', w * 0.47, h * 0.88); g.fillText('E', w * 0.84, h * 0.54); g.fillText('W', w * 0.1, h * 0.54);
    }, { glow: 0.4 });
    K.add(new K.THREE.PlaneGeometry(0.95, 0.95), face2, [0, 0.075, 0], [-Math.PI / 2, 0, 0], { parent: comp, shadow: false });
    var needle2 = new K.THREE.Group(); comp.add(needle2);
    K.cone(0.06, 0.42, K.mat.neon(PAL.red, 1.1), [0, 0, -0.21], [-Math.PI / 2, 0, 0], { parent: needle2 });
    K.cone(0.06, 0.42, K.mat.plastic(0xd7dee6, 0.35), [0, 0, 0.21], [Math.PI / 2, 0, 0], { parent: needle2 });
    needle2.position.y = 0.12;
    K.onTick(function (t) { needle2.rotation.y = -0.9 + Math.sin(t * 0.6) * 0.25; });
    comp.position.set(-1.7, 0.75, -0.3); comp.rotation.z = 0.06;
    K.cyl(0.3, 0.36, 0.55, K.mat.plastic(PAL.bone, 0.5), [-1.7, 0.28, -0.3]);
    K.person({ pos: [-2.3, 0, 0.85], face: 0.6, scale: 0.95, color: PAL.teal, tone: 0x4a2f1d });
    /* three forward stepping stones: evidence, response, commitment */
    var stones = [
      { t: 'EVIDENCE', c: PAL.teal, x: -0.35, z: 0.35 },
      { t: 'RESPONSE', c: PAL.green, x: 0.75, z: -0.05 },
      { t: 'COMMITMENT', c: PAL.amber, x: 1.9, z: -0.45 }
    ];
    stones.forEach(function (st, si) {
      var lit2 = ctx.pathOn ? true : si === 0;
      K.cyl(0.42, 0.46, 0.14 + si * 0.07, K.mat.plastic(lit2 ? 0xeef6f7 : 0xdfe7ee, 0.45), [st.x, (0.14 + si * 0.07) / 2, st.z]);
      var tag2 = K.screen(40, 10, function (g, w, h) {
        g.fillStyle = 'rgba(13,21,38,.92)'; g.fillRect(0, 0, w, h);
        g.fillStyle = lit2 ? '#7ef0f2' : '#5a6f88'; g.font = 'bold 5px monospace'; g.fillText(st.t, w * 0.1, h * 0.72);
      }, { glow: lit2 ? 0.8 : 0.4 });
      var tp = K.add(new K.THREE.PlaneGeometry(0.7, 0.17), tag2, [st.x, 0.62 + si * 0.07, st.z], [0, -0.35, 0], { shadow: false });
      K.float(tp, 0.03, 1.1, si);
      if (lit2) K.halo(0.34, st.c, [st.x, 0.2 + si * 0.07, st.z], { spin: 0.5 });
    });
    /* the walker stepping onto the stones, out toward the field */
    K.person({ pos: [1.2, 0.2, -0.2], face: -0.9, scale: 0.95, color: PAL.orange, tone: 0x8a5a3b });
    K.flow([[-1.7, 0.9, -0.3], [-0.35, 0.5, 0.35], [0.75, 0.55, -0.05], [1.9, 0.65, -0.45]], { color: ctx.pathOn ? PAL.amber : PAL.line, pulseColor: PAL.amber, pulses: 3, speed: 0.1 });
    /* the field beyond: a doorway of light */
    var doorGlow = K.add(new K.THREE.PlaneGeometry(0.9, 1.5), K.mat.holo(hot ? PAL.red : PAL.amber, 0.5), [2.85, 0.85, -0.85], [0, -0.7, 0], { shadow: false });
    K.float(doorGlow, 0.04, 0.9);
  };
  ANCHORS.futurecompass = [[-1.7, 1.0, -0.3], [0.75, 0.7, -0.05], [2.85, 1.1, -0.85]];


  /* in-scene labels: what each key object IS (comprehension first) */
  var TAGS = {
    map: [['A STUDENT', [0, 1.15, 0]], ['PHONE', [-1.9, 1.25, 1.0]], ['CAMERA', [-2.0, 2.05, -1.2]], ['TAP TO PAY', [1.95, 1.15, 1.05]], ['ID CHECK', [2.0, 1.55, -1.15]], ['YOUR NOTICING MAP', [0, 1.0, 1.85]]],
    outcomelens: [['THE SAME RULE', [-1.1, 2.3, 0]], ['OPEN PATH', [-0.25, 0.75, 1.6]], ['BLOCKED', [-1.78, 1.05, 1.15], 1], ['EXTRA BURDEN', [1.35, 1.25, 0.9], 1], ['CASE: APPROVED', [0.4, 1.85, -1.5]], ['CASE: DENIED', [1.55, 1.85, -0.9], 1]],
    pipeline: [['OLD RECORDS', [-2.5, 1.5, -0.1]], ['CONVEYOR', [-1.0, 0.75, 0]], ['SCORING RULE', [0.55, 1.75, 0]], ['APPROVED', [2.45, 0.95, -0.75]], ['DENIED', [2.45, 0.95, 0.75], 1]],
    switches: [['DEFAULT SETTINGS', [-0.55, 1.95, -0.4]], ['THE DOOR', [2.3, 1.95, -0.15]], ['FITS THE DEFAULT', [1.45, 1.35, 0.35]], ['MUST ADAPT', [1.35, 1.35, 1.35], 1]],
    audit: [['THE BENCHMARK TEST', [0, 1.05, 0]], ['AVERAGE LOOKS FINE', [0, 1.95, -0.9]], ['ERRORS CLUSTER HERE', [0, 1.15, 0.85], 1], ['THE AUDITOR', [-2.05, 1.35, 1.15]]],
    gate: [['CHECKPOINT', [0, 2.25, 0]], ['CAMERAS', [-0.95, 2.25, -0.45]], ['FLAGGED', [0, 1.75, 0.9], 1], ['DATABASES', [2.45, 1.75, -0.2]], ['WHO DECIDES?', [-2.3, 1.65, 0.9]]],
    review: [['WEEKS 1 TO 6', [0, 1.55, -1.3]], ['THE PATTERN RETURNS', [0, 2.0, 0]], ['REST IS PART OF IT', [0, 0.95, 1.5]]],
    vault: [['DATA VAULT', [-1.5, 2.35, -0.55]], ['STORIES ABOUT PEOPLE', [0.4, 1.85, 0.4]], ['THE KEY = CONTROL', [1.75, 1.25, 0.85]], ['THE COMMUNITY', [1.55, 1.35, 1.8]]],
    benevolence: [['LOOKS LIKE HELP', [-1.1, 2.05, 0.4]], ['HIDDEN DATA FUNNEL', [1.15, 1.75, -0.75], 1], ['WHERE IT GOES', [2.45, 1.75, -0.35], 1], ['WHO GAINS?', [2.0, 1.65, 1.3]]],
    sorting: [['STUDENT RECORDS', [-1.75, 1.05, 0]], ['THE CUTOFF', [0, 1.95, 0], 1], ['GETS SUPPORT', [2.0, 1.05, -1.1]], ['LEFT WAITING', [1.75, 1.05, 1.2], 1]],
    repair: [['THE HARMED SYSTEM', [0, 1.7, 0]], ['PATCH TOOLS', [-2.2, 1.55, -0.3]], ['WHO LEADS?', [0, 1.15, 1.55]], ['POWER MOVES HERE', [0, 1.75, 0.9]]],
    policy: [['THE PRODUCT', [1.6, 0.45, 0]], ['THE INSTITUTION', [1.35, 0.9, 0]], ['THE LAW', [1.15, 1.35, 0]], ['RIGHTS', [0.95, 1.8, 0]], ['THE GAP', [1.35, 1.5, 0.55], 1], ['LEFT EXPOSED', [2.05, 1.35, 1.1], 1]],
    'return': [['WEEK 1: FIRST NOTES', [2.1, 0.95, -1.15]], ['YOUR CLIMB', [0, 2.15, 0]], ['WEEK 13: WHAT YOU SEE NOW', [-0.4, 2.25, 0.75]]],
    compass: [['THE COURSE QUESTION', [-1.5, 1.55, -1.5]], ['YOUR MAP', [1.55, 1.55, 1.5]], ['YOUR ANSWER POINTS FORWARD', [0, 1.05, 0]], ['YOU, GOING ON', [1.1, 1.45, -1.75]]],
    startermap: [['PICK ONE TOOL', [-2.0, 1.15, -0.65]], ['ASK WHAT IT ASSUMES', [-0.85, 1.45, -0.15]], ['YOUR FIRST MAP ENTRY', [0.35, 1.15, 0.55]]],
    matchwork: [['THE EXAMPLE', [-2.05, 1.45, -0.35]], ['YOUR CHOICE', [-0.2, 1.0, 0.35]], ['COURSE IDEAS', [1.95, 1.15, 0]], ['FEEDBACK', [2.75, 1.15, 0]]],
    mechanismatch: [['THE CASE FILE', [-2.2, 1.15, -0.4]], ['OUTCOMES LENS', [-0.45, 1.95, 0]], ['THE MECHANISMS', [1.85, 1.35, 0]]],
    decisionpath: [['THE INPUT', [-2.15, 1.35, 0]], ['THE DECISION', [-0.35, 1.55, 0]], ['HELPED', [2.3, 1.15, -1.5]], ['HARMED', [2.3, 1.15, 1.5], 1]],
    defaultboard: [['THE DEFAULTS', [-0.85, 2.15, -0.55]], ['WHO ADAPTS?', [1.85, 1.75, -0.35]], ['FITS', [1.35, 1.35, 0.85]], ['CARRIES THE COST', [2.25, 1.35, 0.85], 1]],
    surveillanceflow: [['CHECKPOINT', [-2.0, 1.85, 0]], ['THE FLAG', [-0.55, 1.65, 0.1], 1], ['DATABASE', [0.85, 1.65, -0.85]], ['NEXT CHECKPOINT', [2.35, 1.75, 0.35]], ['APPEAL? ROPED OFF', [0.4, 1.45, 1.6], 1]],
    toolkit: [['PIECES TO REVIEW', [-0.75, 1.15, 0.1]], ['YOUR REVIEW KIT', [0.95, 1.35, 0.1]], ['WHAT YOU CAN SAY NOW', [2.2, 1.45, 0.7]]],
    datastory: [['THE RECORD', [-1.9, 1.65, -0.3]], ['THE STORY IT TELLS', [0.55, 1.75, -0.05]], ['THE PEOPLE IT IS ABOUT', [0.5, 1.15, 1.5]], ['THE KEY = WHO GOVERNS', [2.2, 1.25, 0.45]]],
    promisefunnel: [['THE PROMISE', [-2.0, 1.95, -0.2]], ['THE FUNNEL, X-RAYED', [0.4, 1.85, -0.2], 1], ['WHO GAINS, WHO IS EXPOSED', [2.15, 1.65, 0.45]]],
    detector: [['THREE ESSAYS', [-2.15, 2.35, 0.1]], ['THE DETECTOR', [0.12, 2.45, -0.1]], ['WHO GETS FLAGGED', [2.25, 1.95, 0.35], 1]],
    thresholdaudit: [['THE SCORE', [-1.95, 1.75, -0.25]], ['THE CUTOFF', [0.15, 1.85, 0], 1], ['SUPPORT', [1.8, 1.55, -0.95]], ['JUST MISSED IT', [1.15, 1.75, 1.35], 1], ['HUMAN REVIEW', [1.15, 0.85, 1.35]]],
    repairtable: [['THE HARM', [0, 1.55, 0]], ['PATCH', [-1.65, 1.35, -0.75]], ['REAL REPAIR', [-1.55, 1.35, 0.95]], ['WHO SITS AT THE TABLE', [1.4, 1.15, 1.1]]],
    policydeck: [['POLICY LEVERS', [-0.4, 2.15, 0.35]], ['WHAT EACH FIXES', [2.3, 1.75, -0.2]], ['THE GAP LEFT OVER', [0.9, 1.15, -0.75], 1]],
    capstonemap: [['YOUR WEEK 1 ENTRY', [-1.85, 1.75, -0.55]], ['YOUR WEEK 12 ENTRY', [-1.55, 1.75, 1.05]], ['WHAT CHANGED', [-1.15, 2.0, 0.25]], ['YOUR FINAL PLAN', [1.45, 1.05, 0.15]]],
    futurecompass: [['YOUR COMPASS', [-1.7, 1.45, -0.3]], ['EVIDENCE', [-0.35, 0.95, 0.35]], ['RESPONSE', [0.75, 1.05, -0.05]], ['COMMITMENT', [1.9, 1.15, -0.45]], ['YOUR FIELD, AHEAD', [2.85, 1.95, -0.85]]]
  };
  /* ------------------------------------------------------------ dispatcher */
  /* per-kind camera framing: wide dioramas pull back, bench scenes lean in */
  var FRAMES = {
    _default: { scale: 1.1, cam: [3.35, 2.55, 4.6], look: [0, 0.6, 0] },
    outcomelens: { scale: 0.98, cam: [3.7, 2.75, 5.05], look: [0, 0.55, 0] },
    mechanismatch: { scale: 1.02, cam: [3.6, 2.65, 4.9], look: [0, 0.6, 0] },
    pipeline: { scale: 1.0, cam: [3.65, 2.7, 4.95], look: [0, 0.6, 0] },
    sorting: { scale: 1.0, cam: [3.65, 2.7, 4.95], look: [0, 0.6, 0] },
    compass: { scale: 1.0, cam: [3.6, 2.75, 4.9], look: [0, 0.5, 0] },
    'return': { scale: 1.0, cam: [3.6, 2.8, 4.9], look: [0, 0.85, 0] },
    map: { scale: 1.02, cam: [3.6, 2.65, 4.9], look: [0, 0.55, 0] },
    gate: { scale: 1.04, cam: [3.55, 2.7, 4.85], look: [0, 0.75, 0] },
    review: { scale: 1.05, cam: [3.5, 2.6, 4.8], look: [0, 0.6, 0] },
    policy: { scale: 1.08, cam: [3.45, 2.65, 4.7], look: [0, 0.85, 0] },
    policydeck: { scale: 1.05, cam: [3.5, 2.7, 4.8], look: [0, 0.8, 0] },
    surveillanceflow: { scale: 1.04, cam: [3.55, 2.6, 4.85], look: [0, 0.65, 0] },
    decisionpath: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.55, 0] },
    thresholdaudit: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.6, 0] },
    capstonemap: { scale: 1.08, cam: [3.45, 2.55, 4.7], look: [0, 0.7, 0] },
    futurecompass: { scale: 1.08, cam: [3.45, 2.55, 4.7], look: [0, 0.55, 0] },
    repairtable: { scale: 1.14, cam: [3.25, 2.6, 4.45], look: [0, 0.62, 0] },
    repair: { scale: 1.1, cam: [3.35, 2.6, 4.6], look: [0, 0.7, 0] },
    toolkit: { scale: 1.16, cam: [3.2, 2.45, 4.4], look: [0, 0.65, 0] },
    startermap: { scale: 1.12, cam: [3.3, 2.5, 4.5], look: [0, 0.6, 0] },
    datastory: { scale: 1.12, cam: [3.3, 2.5, 4.5], look: [0, 0.75, 0] },
    vault: { scale: 1.08, cam: [3.45, 2.6, 4.7], look: [0, 0.8, 0] },
    benevolence: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.7, 0] },
    promisefunnel: { scale: 1.08, cam: [3.45, 2.55, 4.7], look: [0, 0.7, 0] },
    detector: { scale: 1.02, cam: [3.55, 2.6, 4.9], look: [0, 0.75, 0], swingRisk: [-0.24, -0.3] },
    switches: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.65, 0] },
    audit: { scale: 1.25, cam: [3.0, 2.3, 4.1], look: [0, 0.6, 0] },
    matchwork: { scale: 1.08, cam: [3.45, 2.55, 4.7], look: [0, 0.55, 0] },
    defaultboard: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.7, 0] }
  };
  window.BFS218_HOLO = {
    version: 5,
    styleFor: styleFor,
    anchors: ANCHORS,
    frame: function (kind, narrow) {
      var f = FRAMES[kind] || FRAMES._default;
      /* Default to a wider, fully readable scene. Reset returns here. */
      var wide = { scale: f.scale * 0.88, cam: [f.cam[0] * 1.15, f.cam[1] * 1.15, f.cam[2] * 1.15], look: f.look, swingRisk: f.swingRisk };
      if (!narrow) return wide;
      return { scale: wide.scale * 0.9, cam: [wide.cam[0] * 1.1, wide.cam[1] * 1.1, wide.cam[2] * 1.1], look: wide.look, swingRisk: wide.swingRisk };
    },
    supports: function (kind) { return !!SCENES[kind]; },
    build: function (THREE, ctx) {
      var scene = SCENES[ctx.kind];
      if (!scene) return null;
      ctx.style = styleFor(ctx.kind);
      var K = makeKit(THREE, ctx);
      K.environment();
      if (ctx.sun) K.shadows(ctx.sun);
      /* Each family gets its own lens, light, and atmosphere. */
      try {
        var looks = {
          technical: { fov: 31, fog: 0xd9ddde, near: 17, far: 34, exposure: 0.96, hemi: [0xf4f2eb, 0x596064, 0.82], key: [0xfff5e6, 2.05], fill: [0xdce8ef, 0.68], rim: [0xe2cfb6, 0.3] },
          civic: { fov: 38, fog: 0xd8d3ca, near: 14, far: 29, exposure: 0.94, hemi: [0xfff4df, 0x4d5559, 0.76], key: [0xffe9cb, 1.82], fill: [0xd7e3eb, 0.54], rim: [0xd4b28f, 0.36] },
          cartographic: { fov: 36, fog: 0xd5d0c4, near: 13, far: 28, exposure: 0.93, hemi: [0xffefd4, 0x505c5c, 0.72], key: [0xffdfad, 1.68], fill: [0xd5e3e6, 0.5], rim: [0xc49f70, 0.42] },
          workshop: { fov: 35, fog: 0xd3cec5, near: 14, far: 29, exposure: 0.91, hemi: [0xffead0, 0x4a5153, 0.7], key: [0xffd9a6, 1.75], fill: [0xd5e2e8, 0.46], rim: [0xc79966, 0.38] },
          diorama: { fov: 37, fog: 0xd8dee2, near: 15, far: 30, exposure: 0.96, hemi: [0xf4f1ea, 0x4f5962, 0.72], key: [0xfff0dc, 1.85], fill: [0xdbe8f3, 0.52], rim: [0xc8d7dc, 0.34] }
        };
        var look = looks[ctx.style] || looks.diorama;
        ctx.camera.fov = look.fov;
        ctx.camera.updateProjectionMatrix();
        ctx.scene.fog = new THREE.Fog(look.fog, look.near, look.far);
        var directionalIndex = 0;
        ctx.scene.traverse(function (o) {
          if (o.isHemisphereLight) {
            o.intensity = look.hemi[2];
            o.color.setHex(look.hemi[0]);
            if (o.groundColor) o.groundColor.setHex(look.hemi[1]);
          } else if (o.isDirectionalLight) {
            directionalIndex++;
            if (directionalIndex === 1) { o.intensity = look.key[1]; o.color.setHex(look.key[0]); }
            else if (directionalIndex === 2) { o.intensity = look.fill[1]; o.color.setHex(look.fill[0]); }
            else { o.intensity = look.rim[1]; o.color.setHex(look.rim[0]); }
          }
        });
        ctx.renderer.toneMappingExposure = look.exposure;
      } catch (e) {}
      scene(K, ctx);
      /* in-scene prediction pads for activity experiments */
      var pickMeshes = [];
      if (ctx.context === 'activity' && ctx.expOptions && ctx.expOptions.length) {
        var padPos = [[-2.3, 0.02, 1.9], [0, 0.02, 2.6], [2.3, 0.02, 1.9]];
        var letters = ['A', 'B', 'C'];
        ctx.expOptions.forEach(function (o, i) {
          var pos = padPos[i] || padPos[0];
          var chosen = ctx.expPick === i;
          var dim = ctx.expRan && !chosen;
          var padMat = chosen ? K.mat.plastic(0x2f6f52, 0.56) : dim ? K.mat.plastic(0x8e969b, 0.78) : K.mat.plastic(0xb7c3c3, 0.7);
          var pad = K.cyl(0.52, 0.58, 0.09, padMat, [pos[0], pos[1] + 0.045, pos[2]]);
          K.torus(0.62, chosen ? 0.024 : 0.016, K.mat.metal(chosen ? 0x82a993 : 0x637579, 0.58), [pos[0], pos[1] + 0.1, pos[2]], [Math.PI / 2, 0, 0], { shadow: false });
          /* Full choice wording remains in the accessible controls below. */
          K.tag(letters[i], [pos[0], i === 1 ? 0.72 : 0.52, pos[2]], { warn: false });
          if (chosen) K.tag('YOUR PREDICTION', [pos[0], 0.95, pos[2]], { warn: false });
          var hit = new THREE.Mesh(new THREE.SphereGeometry(0.85, 8, 6), K.own(new THREE.MeshBasicMaterial({ visible: false })));
          hit.position.set(pos[0], 0.35, pos[2]);
          ctx.root.add(hit);
          K.own(hit.geometry);
          pickMeshes.push({ mesh: hit, idx: i });
        });
      }
      /* A physical result beacon changes with the student's latest simulation. */
      if (ctx.context === 'activity' && ctx.simOutcome) {
        var beacon = new THREE.Group(); ctx.root.add(beacon); beacon.position.set(3.05, 0, 2.0);
        K.rbox(0.28, 0.86, 0.24, K.mat.metal(0x4e5960, 0.62), [0, 0.43, 0], null, { parent: beacon, r: 0.05 });
        var signal = [
          { id: 'positive', c: PAL.green, y: 0.65 },
          { id: 'neutral', c: PAL.amber, y: 0.43 },
          { id: 'burden', c: PAL.red, y: 0.21 }
        ];
        signal.forEach(function (s) {
          var active = ctx.simOutcome === s.id;
          K.sph(0.07, active ? K.mat.neon(s.c, 0.8) : K.mat.plastic(0x737d81, 0.82), [0, s.y, 0.13], { parent: beacon, shadow: false });
        });
        K.box(0.34, 0.04, 0.32, K.mat.metal(0x3d464b, 0.7), [0, 0.02, 0], null, { parent: beacon });
      }
      var tags = TAGS[ctx.kind] || [];
      for (var tgi = 0; tgi < tags.length; tgi++) {
        try { K.tag(tags[tgi][0], tags[tgi][1], { warn: !!tags[tgi][2] }); } catch (e) {}
      }
      /* settle one frame at t=0 so static/reduced-motion renders place every animated part */
      for (var ti = 0; ti < K.ticks.length; ti++) { try { K.ticks[ti](0); } catch (e) {} }
      return {
        skipDefaultStage: true,
        pickMeshes: pickMeshes,
        tick: function (t) {
          for (var i = 0; i < K.ticks.length; i++) {
            try { K.ticks[i](t); } catch (e) {}
          }
        },
        dispose: function () {
          K.textures.forEach(function (tx) { try { tx.dispose(); } catch (e) {} });
          K.disposables.forEach(function (d) { try { d.dispose(); } catch (e) {} });
        }
      };
    }
  };
})();
