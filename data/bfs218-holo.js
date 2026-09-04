/* BFS218 Visual Worlds v20 - course-specific 3D support. Weeks 2 and 3 now use
   direct guided investigations in app.js rather than separate rendered scenes.
   The library makes no network calls. */
(function () {
  'use strict';

  var PAL = {
    ink: 0x1b2a4a, inkSoft: 0x33456b, teal: 0x00aeb3, tealSoft: 0x9fdde0,
    orange: 0xffa12b, amber: 0xffcc66, red: 0xda291c, redSoft: 0xfbe9ea,
    green: 0x1c7a43, greenSoft: 0xe7f3ec, bone: 0xf4f1ea, white: 0xffffff,
    steel: 0xb9c4cf, floor: 0xe9eef2, line: 0x8ba0b4
  };

  /* Five art-direction families. The family controls form, material, camera,
     and atmosphere; each kind still controls the week's instructional content. */
  var STYLE_KINDS = {
    archive: ['map', 'gate', 'benevolence', 'startermap', 'surveillanceflow', 'promisefunnel'],
    garden: ['outcomelens', 'repair', 'compass', 'mechanismatch', 'futurecompass'],
    maze: ['pipeline', 'review', 'sorting', 'decisionpath', 'toolkit', 'thresholdaudit', 'matchwork', 'repairtable'],
    paper: ['switches', 'audit', 'policy', 'defaultboard', 'policydeck', 'detector', 'datastory'],
    terrain: ['vault', 'return', 'capstonemap']
  };
  function styleFor(kind) {
    var names = Object.keys(STYLE_KINDS);
    for (var i = 0; i < names.length; i++) if (STYLE_KINDS[names[i]].indexOf(kind) >= 0) return names[i];
    return 'maze';
  }

  var FAMILY_PALETTES = {
    archive: {
      ink: 0x20262b, inkSoft: 0x56636b, teal: 0xe4edef, tealSoft: 0xb8c8cc,
      orange: 0xa85243, amber: 0xd5b38d, red: 0xb8221b, redSoft: 0xead5d1,
      green: 0x697b70, greenSoft: 0xd6dfd8, bone: 0xe4dfd5, white: 0xf8f5ee,
      steel: 0x7d898e, floor: 0xbab8b0, line: 0x687a80
    },
    garden: {
      ink: 0x172a50, inkSoft: 0x315d83, teal: 0x3158d8, tealSoft: 0xaac5ff,
      orange: 0xffbd2e, amber: 0xffdf75, red: 0xee5b53, redSoft: 0xffddd7,
      green: 0x237b52, greenSoft: 0xb0ddc2, bone: 0xf3e9cc, white: 0xfffdf4,
      steel: 0x687f76, floor: 0xd9e7bd, line: 0x4e9971
    },
    maze: {
      ink: 0x24272c, inkSoft: 0x4d5962, teal: 0x008e92, tealSoft: 0xa7d9d7,
      orange: 0xd99a2b, amber: 0xe7bd68, red: 0xc42c23, redSoft: 0xefd8d2,
      green: 0x2d7058, greenSoft: 0xd2e2d7, bone: 0xf0ebe0, white: 0xfbf9f3,
      steel: 0x72787b, floor: 0xd7d3ca, line: 0x657174
    },
    paper: {
      ink: 0x112457, inkSoft: 0x3d568e, teal: 0x2658d5, tealSoft: 0xb5c8fb,
      orange: 0xff7900, amber: 0xffbd45, red: 0xd31f3e, redSoft: 0xf6cbd3,
      green: 0x176b68, greenSoft: 0xc4ded7, bone: 0xf2e4c3, white: 0xfffbef,
      steel: 0x586b8f, floor: 0xead7b3, line: 0x3a55a3
    },
    terrain: {
      ink: 0x39334f, inkSoft: 0x6d6480, teal: 0x3c9c96, tealSoft: 0xbfe4d6,
      orange: 0xf1c84b, amber: 0xf6dda1, red: 0xd8755e, redSoft: 0xf2d2c9,
      green: 0x68a86c, greenSoft: 0xcce3c4, bone: 0xf1dcc9, white: 0xfff9ed,
      steel: 0x8d7a92, floor: 0xe4c7c7, line: 0x76658b
    },
    realist: {
      ink: 0x24282b, inkSoft: 0x4b5358, teal: 0x2f7472, tealSoft: 0xaebfbb,
      orange: 0xa97835, amber: 0xc6a36a, red: 0x8f2924, redSoft: 0xc8a9a4,
      green: 0x496957, greenSoft: 0xb9c5b8, bone: 0xd8d1c5, white: 0xf0ece3,
      steel: 0x7d8589, floor: 0x9a958d, line: 0x697378
    }
  };

  function familyColor(c, style) {
    var family = FAMILY_PALETTES[style] || FAMILY_PALETTES.maze;
    var keys = Object.keys(PAL);
    for (var i = 0; i < keys.length; i++) if (PAL[keys[i]] === c) return family[keys[i]];
    return c;
  }

  /* ------------------------------------------------------------------ kit */
  function makeKit(THREE, ctx) {
    var K = { THREE: THREE, ctx: ctx, ticks: [], disposables: [], textures: [], labels: [] };
    var root = ctx.root;

    K.onTick = function (fn) { K.ticks.push(fn); };
    K.own = function (obj) { K.disposables.push(obj); return obj; };

    /* --- environment reflections (hand-rolled room, PMREM) --- */
    K.environment = function () {
      try {
        var style = ctx.style || styleFor(ctx.kind);
        var rooms = {
          archive: { wall: 0x8f9495, key: 0xfff4dd, fill: 0xb9c8cc, edge: 0x87332d, bounce: 0x737d80 },
          garden: { wall: 0xcbd9b2, key: 0xfff0ad, fill: 0xaec7ff, edge: 0xef7460, bounce: 0x7caf83 },
          maze: { wall: 0xd8d3c8, key: 0xfff1d7, fill: 0xc6dee0, edge: 0xbd9761, bounce: 0x8b9290 },
          paper: { wall: 0xd9c7a5, key: 0xffe8bc, fill: 0xb9cafa, edge: 0xe1562f, bounce: 0x6476a1 },
          terrain: { wall: 0xd8bfc2, key: 0xffefc7, fill: 0xb9ddd4, edge: 0xd59172, bounce: 0x8f7990 },
          realist: { wall: 0x777b7c, key: 0xffe6c4, fill: 0xaebfc2, edge: 0x7f332e, bounce: 0x555c60 }
        };
        var room = rooms[style] || rooms.maze;
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
        env.traverse(function (obj) {
          if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose();
          if (obj.material && obj.material.dispose) obj.material.dispose();
        });
        if (env.clear) env.clear();
      } catch (e) { /* environment is an enhancement, never a blocker */ }
    };

    /* --- soft shadows (lighter on phones) --- */
    K.shadows = function (sun) {
      try {
        var small = false;
        try { small = window.matchMedia && window.matchMedia('(max-width: 760px)').matches; } catch (e2) {}
        if (['outcomelens', 'benevolence', 'repair'].indexOf(ctx.kind) >= 0) ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
        else if (small) ctx.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        ctx.renderer.shadowMap.enabled = true;
        ctx.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sun.castShadow = true;
        sun.shadow.mapSize.set(small ? 512 : 1024, small ? 512 : 1024);
        sun.shadow.camera.near = 1; sun.shadow.camera.far = 20;
        sun.shadow.camera.left = -5; sun.shadow.camera.right = 5;
        sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -3;
        sun.shadow.bias = -0.0006;
        sun.shadow.normalBias = 0.018;
        sun.shadow.radius = 4;
      } catch (e) {}
    };

    /* --- materials --- */
    K.mat = {};
    K.color = function (c) { return familyColor(c, ctx.style || styleFor(ctx.kind)); };
    K.mat.plastic = function (c, rough) {
      var style = ctx.style || styleFor(ctx.kind);
      var profile = {
        archive: { rough: 0.88, metal: 0.015, coat: 0.01, env: 0.42 },
        garden: { rough: 0.94, metal: 0.0, coat: 0.0, env: 0.34 },
        maze: { rough: 0.42, metal: 0.015, coat: 0.32, env: 0.86 },
        paper: { rough: 0.96, metal: 0.0, coat: 0.0, env: 0.24 },
        terrain: { rough: 0.9, metal: 0.0, coat: 0.01, env: 0.3 },
        realist: { rough: 0.68, metal: 0.03, coat: 0.08, env: 0.72 }
      }[style] || { rough: 0.72, metal: 0.01, coat: 0.08, env: 0.62 };
      return K.own(new THREE.MeshPhysicalMaterial({
        color: K.color(c), roughness: rough == null ? profile.rough : Math.max(rough, profile.rough - 0.16),
        metalness: profile.metal, clearcoat: profile.coat, clearcoatRoughness: profile.rough, envMapIntensity: profile.env
      }));
    };
    K.mat.metal = function (c, rough) {
      var style = ctx.style || styleFor(ctx.kind);
      var paperLike = style === 'paper' || style === 'garden' || style === 'terrain';
      return K.own(new THREE.MeshPhysicalMaterial({
        color: K.color(c == null ? PAL.steel : c), roughness: rough == null ? (paperLike ? 0.82 : 0.5) : rough,
        metalness: paperLike ? 0.12 : (style === 'archive' ? 0.46 : 0.62), clearcoat: style === 'maze' ? 0.16 : 0.03,
        clearcoatRoughness: paperLike ? 0.86 : 0.62, envMapIntensity: paperLike ? 0.48 : 1.02
      }));
    };
    K.mat.ink = function () { return K.mat.plastic(PAL.ink, 0.58); };
    K.mat.glass = function (c, opacity) {
      return K.own(new THREE.MeshPhysicalMaterial({
        color: K.color(c == null ? PAL.tealSoft : c), transparent: true, opacity: opacity == null ? 0.34 : opacity,
        roughness: (ctx.style === 'archive' || ctx.style === 'paper') ? 0.48 : 0.16, metalness: 0.01,
        transmission: ctx.style === 'paper' ? 0.02 : 0.34, thickness: 0.28,
        clearcoat: ctx.style === 'maze' ? 0.62 : 0.24, clearcoatRoughness: 0.25, ior: 1.45, envMapIntensity: 0.72, side: THREE.DoubleSide
      }));
    };
    K.mat.neon = function (c, intensity) {
      c = K.color(c);
      return K.own(new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: intensity == null ? 0.18 : Math.min(0.38, intensity * 0.24), roughness: ctx.style === 'paper' ? 0.82 : 0.58, metalness: 0.04, envMapIntensity: 0.5 }));
    };
    K.mat.holo = function (c, opacity) {
      var mat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color(K.color(c == null ? PAL.teal : c)) },
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
          ' float fres=pow(1.0-clamp(abs(dot(normalize(vN),normalize(vV))),0.0,1.0),2.4);',
          ' float scan=0.82+0.18*sin(vUv.y*110.0+uTime*2.0);',
          ' float band=smoothstep(0.98,1.0,fract(vUv.y*1.0-uTime*0.07));',
          ' float a=uOpacity*(0.24+0.52*fres+0.06*scan+0.26*band);',
          ' vec3 glow=mix(uColor,vec3(1.0,0.98,0.92),fres*0.35);',
          ' gl_FragColor=vec4(glow*(0.85+0.4*fres),a); }'
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
      var mat = K.own(new THREE.MeshStandardMaterial({ map: tex, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: opts.glow == null ? 0.22 : Math.min(0.5, opts.glow * 0.55), roughness: 0.46, metalness: 0.01, envMapIntensity: 0.42 }));
      return mat;
    };

    /* --- realistic activity materials and fixtures --------------------- */
    K.real = { materials: {} };
    K.real.surface = function (kind) {
      if (K.real.materials[kind]) return K.real.materials[kind];
      var swatches = {
        concrete: ['#aaa69e', '#7d7a74'], limestone: ['#d0c7b8', '#aaa08f'],
        oak: ['#8b5d36', '#5b3822'], steel: ['#969da0', '#555d61'],
        darkSteel: ['#394146', '#1f2529'], paper: ['#f3eee3', '#d6cdbd'],
        leather: ['#5b4031', '#2e211b'], rubber: ['#282d30', '#141719']
      };
      var pair = swatches[kind] || swatches.concrete;
      var tex = K.texture(384, 384, function (g, w, h) {
        g.fillStyle = pair[0]; g.fillRect(0, 0, w, h);
        var seed = 218 + kind.length * 97;
        function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
        if (kind === 'oak') {
          for (var y = 0; y < h; y += 5) {
            g.strokeStyle = 'rgba(48,25,13,' + (0.08 + rnd() * 0.12) + ')';
            g.lineWidth = 1 + rnd() * 2; g.beginPath(); g.moveTo(0, y + rnd() * 6);
            for (var x = 0; x <= w; x += 24) g.lineTo(x, y + Math.sin(x * 0.045 + y) * (2 + rnd() * 3));
            g.stroke();
          }
        } else if (kind === 'steel' || kind === 'darkSteel') {
          for (var sx = 0; sx < w; sx += 3) {
            g.fillStyle = sx % 9 ? 'rgba(255,255,255,.018)' : 'rgba(0,0,0,.035)';
            g.fillRect(sx, 0, 1, h);
          }
          for (var sc = 0; sc < 70; sc++) {
            g.strokeStyle = 'rgba(255,255,255,.045)'; g.beginPath();
            g.moveTo(rnd() * w, rnd() * h); g.lineTo(rnd() * w, rnd() * h); g.stroke();
          }
        } else if (kind === 'paper') {
          for (var pf = 0; pf < 420; pf++) {
            g.fillStyle = pf % 2 ? 'rgba(90,70,48,.035)' : 'rgba(255,255,255,.08)';
            g.fillRect(rnd() * w, rnd() * h, 8 + rnd() * 22, 0.7);
          }
        } else {
          for (var n = 0; n < 1600; n++) {
            var a = 0.025 + rnd() * 0.08;
            g.fillStyle = rnd() > 0.48 ? 'rgba(255,255,255,' + a + ')' : 'rgba(35,31,27,' + a + ')';
            var rr = 0.5 + rnd() * (kind === 'concrete' ? 2.2 : 1.2);
            g.fillRect(rnd() * w, rnd() * h, rr, rr);
          }
        }
      });
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(kind === 'oak' ? 2 : 3, kind === 'oak' ? 2 : 3);
      var metal = kind === 'steel' || kind === 'darkSteel';
      var mat = K.own(new THREE.MeshPhysicalMaterial({
        map: tex, color: 0xffffff, roughness: metal ? 0.36 : (kind === 'leather' ? 0.62 : 0.82),
        metalness: metal ? 0.76 : 0.01, clearcoat: kind === 'oak' ? 0.24 : 0.02,
        clearcoatRoughness: kind === 'oak' ? 0.48 : 0.8, envMapIntensity: metal ? 1.15 : 0.58
      }));
      K.real.materials[kind] = mat;
      return mat;
    };
    K.real.accent = function (color, hot) {
      color = K.color(color == null ? PAL.teal : color);
      return K.own(new THREE.MeshPhysicalMaterial({
        color: color, roughness: 0.38, metalness: 0.42, clearcoat: 0.18,
        clearcoatRoughness: 0.42, emissive: hot ? color : 0x000000,
        emissiveIntensity: hot ? 0.12 : 0, envMapIntensity: 0.95
      }));
    };
    K.real.table = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      var w = opts.w || 2.6, d = opts.d || 1.35, h = opts.h || 0.72;
      K.rbox(w, 0.11, d, opts.top || K.real.surface('oak'), [0, h, 0], null, { parent: g, r: 0.035 });
      var inset = Math.min(0.24, w * 0.12);
      [[-w / 2 + inset, -d / 2 + inset], [w / 2 - inset, -d / 2 + inset], [-w / 2 + inset, d / 2 - inset], [w / 2 - inset, d / 2 - inset]].forEach(function (p) {
        K.box(0.065, h, 0.065, K.real.surface('darkSteel'), [p[0], h / 2, p[1]], null, { parent: g });
      });
      K.box(w - 0.35, 0.045, 0.045, K.real.surface('steel'), [0, h * 0.44, -d / 2 + inset], null, { parent: g });
      g.position.set(pos[0], pos[1] || 0, pos[2]);
      if (opts.rot) g.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
      return g;
    };
    K.real.frame = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      var w = opts.w || 1.2, h = opts.h || 1.65, d = opts.d || 0.18, beam = opts.beam || 0.09;
      var mat = opts.mat || K.real.surface('darkSteel');
      K.rbox(beam, h, d, mat, [-w / 2, h / 2, 0], null, { parent: g, r: 0.018 });
      K.rbox(beam, h, d, mat, [w / 2, h / 2, 0], null, { parent: g, r: 0.018 });
      K.rbox(w + beam, beam, d, mat, [0, h, 0], null, { parent: g, r: 0.018 });
      if (opts.light != null) {
        var lc = opts.light;
        K.box(0.018, h - 0.18, d + 0.018, K.mat.neon(lc, 0.48), [-w / 2 + beam * 0.62, h / 2, 0.012], null, { parent: g, shadow: false });
        K.box(0.018, h - 0.18, d + 0.018, K.mat.neon(lc, 0.48), [w / 2 - beam * 0.62, h / 2, 0.012], null, { parent: g, shadow: false });
      }
      g.position.set(pos[0], pos[1] || 0, pos[2]); if (opts.face != null) g.rotation.y = opts.face;
      return g;
    };
    K.real.lens = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      var r = opts.r || 0.42;
      K.torus(r, r * 0.075, K.real.surface('steel'), [0, 0, 0], null, { parent: g });
      K.add(new THREE.CircleGeometry(r * 0.92, 64), K.mat.glass(opts.color || PAL.tealSoft, 0.28), [0, 0, -0.012], null, { parent: g, shadow: false });
      K.cyl(r * 0.055, r * 0.065, r * 0.78, K.real.surface('leather'), [r * 0.83, -r * 0.83, 0], [0, 0, -0.78], { parent: g });
      g.position.set(pos[0], pos[1], pos[2]); if (opts.rot) g.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
      return g;
    };
    K.real.gear = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      var r = opts.r || 0.38, teeth = opts.teeth || 14, mat = opts.mat || K.real.surface('steel');
      K.cyl(r * 0.72, r * 0.72, opts.d || 0.11, mat, [0, 0, 0], [Math.PI / 2, 0, 0], { parent: g, seg: 48 });
      K.torus(r * 0.72, r * 0.11, mat, [0, 0, 0], null, { parent: g });
      for (var i = 0; i < teeth; i++) {
        var a = i / teeth * Math.PI * 2;
        K.rbox(r * 0.25, r * 0.15, opts.d || 0.13, mat, [Math.cos(a) * r * 0.86, Math.sin(a) * r * 0.86, 0], [0, 0, a], { parent: g, r: 0.012 });
      }
      K.cyl(r * 0.18, r * 0.18, (opts.d || 0.11) + 0.035, K.real.surface('darkSteel'), [0, 0, 0], [Math.PI / 2, 0, 0], { parent: g, seg: 36 });
      g.position.set(pos[0], pos[1], pos[2]); if (opts.rot) g.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
      return g;
    };
    K.real.book = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      var w = opts.w || 1.0, h = opts.h || 0.7;
      K.rbox(w * 0.52, 0.045, h, K.real.surface('leather'), [-w * 0.26, 0, 0], [0, 0, 0.03], { parent: g, r: 0.018 });
      K.rbox(w * 0.52, 0.045, h, K.real.surface('leather'), [w * 0.26, 0, 0], [0, 0, -0.03], { parent: g, r: 0.018 });
      K.rbox(w * 0.49, 0.025, h * 0.94, K.real.surface('paper'), [-w * 0.255, 0.045, 0], [0, 0, 0.03], { parent: g, r: 0.008 });
      K.rbox(w * 0.49, 0.025, h * 0.94, K.real.surface('paper'), [w * 0.255, 0.045, 0], [0, 0, -0.03], { parent: g, r: 0.008 });
      K.cyl(0.025, 0.025, h * 0.94, K.real.surface('darkSteel'), [0, 0.055, 0], [Math.PI / 2, 0, 0], { parent: g, seg: 20 });
      g.position.set(pos[0], pos[1], pos[2]); if (opts.rot) g.rotation.set(opts.rot[0], opts.rot[1], opts.rot[2]);
      return g;
    };
    K.real.chair = function (pos, opts) {
      opts = opts || {}; var g = new THREE.Group(); (opts.parent || root).add(g);
      K.rbox(0.42, 0.08, 0.4, K.real.surface('leather'), [0, 0.45, 0], null, { parent: g, r: 0.06 });
      K.rbox(0.42, 0.52, 0.075, K.real.surface('leather'), [0, 0.72, -0.18], [-0.08, 0, 0], { parent: g, r: 0.07 });
      K.cyl(0.035, 0.045, 0.42, K.real.surface('steel'), [0, 0.22, 0], null, { parent: g, seg: 22 });
      for (var i = 0; i < 5; i++) {
        var a = i / 5 * Math.PI * 2;
        K.box(0.035, 0.035, 0.33, K.real.surface('darkSteel'), [Math.sin(a) * 0.13, 0.04, Math.cos(a) * 0.13], [0, a, 0], { parent: g });
      }
      g.position.set(pos[0], pos[1] || 0, pos[2]); if (opts.face != null) g.rotation.y = opts.face;
      return g;
    };

    /* --- five structural stage languages; content remains kind-specific --- */
    K.stage = function (opts) {
      opts = opts || {};
      var style = opts.style || ctx.style || styleFor(ctx.kind);
      var floorTex = K.texture(512, 512, function (g) {
        var palettes = {
          archive: ['#d9d7cf', '#aaa9a3', '#6e7476'],
          garden: ['#c6db89', '#73a96d', '#326f53'],
          maze: ['#eee9df', '#c9c4ba', '#777d7c'],
          paper: ['#f1e4c8', '#d9bc86', '#9a774c'],
          terrain: ['#ecd7cc', '#c9a6ad', '#776782'],
          realist: ['#b8b3aa', '#8c8881', '#555b5e']
        };
        var pc = palettes[style] || palettes.maze;
        var grad = (style === 'archive' || style === 'paper') ? g.createLinearGradient(0, 0, 512, 512) : g.createRadialGradient(256, 256, 40, 256, 256, 330);
        grad.addColorStop(0, pc[0]);
        grad.addColorStop(0.58, pc[1]);
        grad.addColorStop(1, pc[2]);
        g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
        g.globalAlpha = style === 'paper' ? 0.2 : 0.12;
        var seed = 218;
        function noise() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
        for (var n = 0; n < 1800; n++) {
          var v = 110 + Math.floor(noise() * 70);
          g.fillStyle = 'rgb(' + v + ',' + v + ',' + Math.max(100, v - 5) + ')';
          g.fillRect(noise() * 512, noise() * 512, 1.2, 1.2);
        }
        g.globalAlpha = 1;
        if (style === 'archive') {
          g.strokeStyle = 'rgba(39,47,50,.23)'; g.lineWidth = 2;
          for (var i = 0; i <= 12; i++) {
            g.beginPath(); g.moveTo(i * 43, 0); g.lineTo(i * 43, 512); g.stroke();
          }
          g.fillStyle = 'rgba(184,34,27,.76)'; g.fillRect(248, 0, 8, 512);
          g.strokeStyle = 'rgba(255,255,255,.24)'; g.lineWidth = 1;
          for (var ar = 24; ar < 512; ar += 36) {
            g.strokeRect(20, ar, 472, 22);
          }
        } else if (style === 'garden') {
          g.strokeStyle = 'rgba(31,104,70,.42)'; g.lineWidth = 8; g.lineCap = 'round';
          for (var vr = 0; vr < 5; vr++) {
            g.beginPath();
            g.moveTo(256, 256);
            g.bezierCurveTo(120 + vr * 30, 190 - vr * 18, 90 + vr * 48, 70 + vr * 70, 20 + vr * 116, vr % 2 ? 490 : 24);
            g.stroke();
          }
          for (var gn = 0; gn < 24; gn++) {
            g.fillStyle = gn % 3 === 0 ? 'rgba(49,88,216,.55)' : gn % 3 === 1 ? 'rgba(255,189,46,.55)' : 'rgba(35,123,82,.55)';
            g.beginPath(); g.arc(noise() * 512, noise() * 512, 4 + noise() * 9, 0, Math.PI * 2); g.fill();
          }
        } else if (style === 'maze') {
          var lanes = ['rgba(196,44,35,.58)', 'rgba(217,154,43,.58)', 'rgba(0,142,146,.58)'];
          for (var ml = 0; ml < 3; ml++) {
            g.strokeStyle = lanes[ml]; g.lineWidth = 12; g.lineCap = 'round';
            g.beginPath(); g.moveTo(90 + ml * 165, 510); g.bezierCurveTo(75 + ml * 155, 390, 165 + ml * 90, 300, 256, 250); g.stroke();
          }
          g.strokeStyle = 'rgba(35,39,44,.45)'; g.lineWidth = 7;
          for (var mw = 0; mw < 4; mw++) {
            g.strokeRect(58 + mw * 104, 58 + (mw % 2) * 50, 70, 120);
          }
        } else if (style === 'paper') {
          g.strokeStyle = 'rgba(17,36,87,.32)'; g.lineWidth = 2;
          for (var py = 24; py < 512; py += 29) { g.beginPath(); g.moveTo(0, py); g.lineTo(512, py + 5); g.stroke(); }
          g.strokeStyle = 'rgba(211,31,62,.75)'; g.lineWidth = 5; g.setLineDash([18, 10]);
          g.beginPath(); g.moveTo(42, 440); g.lineTo(470, 82); g.stroke(); g.setLineDash([]);
          for (var pf = 0; pf < 15; pf++) {
            g.fillStyle = pf % 2 ? 'rgba(38,88,213,.17)' : 'rgba(255,121,0,.16)';
            g.fillRect(noise() * 470, noise() * 470, 24 + noise() * 54, 8 + noise() * 24);
          }
        } else if (style === 'terrain') {
          for (var c = 0; c < 8; c++) {
            g.strokeStyle = 'rgba(57,51,79,' + (0.18 + c * 0.015) + ')'; g.lineWidth = 2.2;
            g.beginPath();
            for (var a = 0; a <= 120; a++) {
              var ang = a / 120 * Math.PI * 2;
              var rr = 42 + c * 25 + Math.sin(ang * 3 + c) * 10 + Math.cos(ang * 5 - c) * 6;
              var xx = 256 + Math.cos(ang) * rr, yy = 256 + Math.sin(ang) * rr;
              if (!a) g.moveTo(xx, yy); else g.lineTo(xx, yy);
            }
            g.closePath(); g.stroke();
          }
          g.strokeStyle = 'rgba(60,156,150,.8)'; g.lineWidth = 10;
          g.beginPath(); g.moveTo(-10, 360); g.bezierCurveTo(110, 315, 220, 390, 310, 290); g.bezierCurveTo(380, 220, 430, 285, 522, 170); g.stroke();
        }
      });
      var floorMat = K.own(new THREE.MeshPhysicalMaterial({
        map: floorTex, roughness: style === 'maze' ? 0.48 : 0.9,
        metalness: style === 'archive' ? 0.08 : 0.01, clearcoat: style === 'maze' ? 0.24 : 0.01,
        clearcoatRoughness: style === 'maze' ? 0.42 : 0.88, envMapIntensity: style === 'maze' ? 0.78 : 0.42
      }));
      var stage;
      if (style === 'realist') {
        stage = K.rbox(7.35, 0.18, 5.2, K.real.surface('concrete'), [0, -0.1, 0], null, { r: 0.045 });
        K.rbox(7.5, 0.14, 5.34, K.real.surface('darkSteel'), [0, -0.25, 0], null, { r: 0.055 });
        K.rbox(6.7, 0.035, 4.55, K.real.surface('limestone'), [0, 0.008, 0], null, { r: 0.025, shadow: false });
        for (var rs = -2; rs <= 2; rs++) {
          K.box(0.014, 0.012, 4.42, K.real.surface('steel'), [rs * 1.28, 0.032, 0], null, { shadow: false });
        }
        K.box(6.6, 0.014, 0.014, K.real.surface('steel'), [0, 0.034, 0], null, { shadow: false });
        K.box(6.85, 0.018, 0.025, K.real.accent(PAL.red, false), [0, 0.043, 2.12], null, { shadow: false });
      } else if (style === 'archive') {
        stage = K.rbox(7.35, 0.17, 5.2, floorMat, [0, -0.1, 0], null, { r: 0.045 });
        K.rbox(7.48, 0.12, 5.34, K.mat.metal(PAL.steel, 0.75), [0, -0.23, 0], null, { r: 0.05 });
        var archiveX = [-3.22, -2.55, 2.55, 3.22];
        for (var ai = 0; ai < archiveX.length; ai++) {
          var ah = ai % 2 ? 2.55 : 3.35;
          K.rbox(0.5, ah, 0.32, K.mat.plastic(ai % 2 ? PAL.bone : PAL.steel, 0.94), [archiveX[ai], ah / 2 - 0.03, -2.42], null, { r: 0.025 });
          for (var ad = 0; ad < 5; ad++) K.box(0.42, 0.015, 0.34, K.mat.plastic(PAL.inkSoft, 0.96), [archiveX[ai], 0.28 + ad * (ah - 0.4) / 5, -2.405], null, { shadow: false });
        }
        K.box(0.045, 0.035, 5.0, K.mat.neon(PAL.red, 0.9), [0, 0.015, 0], null, { shadow: false });
        K.box(0.055, 3.1, 0.08, K.mat.neon(PAL.red, 0.75), [-3.52, 1.45, -2.34], null, { shadow: false });
      } else if (style === 'garden') {
        stage = K.add(new THREE.CylinderGeometry(3.35, 3.5, 0.14, 48), floorMat, [0, -0.09, 0]);
        stage.scale.z = 0.78;
        var islands = [[-2.65, -1.5, 0.9, 0.75], [2.65, -1.35, 0.82, 0.7], [-2.8, 1.45, 0.75, 0.62], [2.75, 1.5, 0.9, 0.72]];
        for (var gi = 0; gi < islands.length; gi++) {
          var isl = islands[gi];
          var island = K.cyl(isl[2], isl[2] * 1.08, 0.12, K.mat.plastic(gi % 2 ? PAL.greenSoft : PAL.bone, 0.96), [isl[0], -0.055, isl[1]], null, { seg: 32 });
          island.scale.z = isl[3];
          K.sph(0.14 + gi * 0.012, K.mat.plastic(gi % 2 ? PAL.orange : PAL.teal, 0.94), [isl[0], 0.11, isl[1]]);
        }
        var rootCurves = [
          [[-3.1, 0.02, -1.8], [-2.0, 0.05, -2.25], [-0.8, 0.03, -2.36]],
          [[3.1, 0.02, -1.8], [2.0, 0.06, -2.3], [0.9, 0.03, -2.38]],
          [[-3.0, 0.02, 1.8], [-2.2, 0.06, 2.25], [-1.0, 0.03, 2.36]],
          [[3.0, 0.02, 1.8], [2.2, 0.06, 2.25], [1.0, 0.03, 2.36]]
        ];
        for (var gr = 0; gr < rootCurves.length; gr++) {
          var curve = new THREE.CatmullRomCurve3(rootCurves[gr].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
          K.add(new THREE.TubeGeometry(curve, 24, 0.035, 8, false), K.mat.plastic(gr % 2 ? PAL.green : PAL.teal, 0.96), null, null, { shadow: false });
        }
      } else if (style === 'maze') {
        stage = K.rbox(7.25, 0.15, 5.2, floorMat, [0, -0.09, 0], null, { r: 0.22 });
        K.rbox(7.38, 0.1, 5.34, K.mat.metal(PAL.ink, 0.5), [0, -0.21, 0], null, { r: 0.24 });
        var laneColors = [PAL.red, PAL.orange, PAL.teal];
        for (var mi = 0; mi < 3; mi++) {
          var mx = -2.35 + mi * 2.35;
          K.rbox(0.42, 0.035, 1.4, K.mat.plastic(laneColors[mi], 0.42), [mx, 0.012, 1.84], null, { r: 0.16, shadow: false });
          K.box(0.08, 0.72, 0.08, K.mat.metal(PAL.ink, 0.42), [mx - 0.34, 0.36, -2.15]);
          K.box(0.08, 0.72, 0.08, K.mat.metal(PAL.ink, 0.42), [mx + 0.34, 0.36, -2.15]);
          K.box(0.76, 0.08, 0.08, K.mat.metal(laneColors[mi], 0.38), [mx, 0.72, -2.15]);
        }
      } else if (style === 'paper') {
        stage = K.rbox(7.2, 0.09, 5.05, floorMat, [0, -0.055, 0], null, { r: 0.015 });
        K.rbox(7.32, 0.06, 5.17, K.mat.plastic(PAL.ink, 0.96), [0, -0.135, 0], null, { r: 0.02 });
        var paperPanels = [
          [-3.1, 2.2, 0.62, PAL.teal], [-2.15, 3.0, 0.86, PAL.bone],
          [0, 2.45, 1.1, PAL.orange], [2.05, 3.25, 0.9, PAL.white], [3.05, 2.1, 0.62, PAL.red]
        ];
        for (var pi = 0; pi < paperPanels.length; pi++) {
          var pp = paperPanels[pi];
          K.rbox(pp[2], pp[1], 0.045, K.mat.plastic(pp[3], 0.98), [pp[0], pp[1] / 2 - 0.01, -2.49 + pi * 0.012], null, { r: 0.018 });
        }
        K.box(6.35, 0.045, 0.045, K.mat.plastic(PAL.ink, 0.96), [0, 0.55, -2.42], [0, 0, -0.08], { shadow: true });
      } else {
        stage = K.add(new THREE.CylinderGeometry(3.5, 3.62, 0.13, 64), floorMat, [0, -0.07, 0]);
        stage.scale.z = 0.82;
        var terrainTiers = [
          [3.72, 0.08, -0.16, PAL.inkSoft, 0.82], [3.35, 0.07, -0.24, PAL.redSoft, 0.77],
          [2.95, 0.065, -0.31, PAL.greenSoft, 0.72]
        ];
        for (var ti = 0; ti < terrainTiers.length; ti++) {
          var tr = terrainTiers[ti];
          var tier = K.cyl(tr[0], tr[0] * 1.02, tr[1], K.mat.plastic(tr[3], 0.96), [0.12 * ti, tr[2], -0.08 * ti], null, { seg: 64 });
          tier.scale.z = tr[4];
        }
        for (var ring = 0; ring < 4; ring++) {
          var contour = K.torus(2.55 + ring * 0.27, 0.012, K.mat.plastic(ring % 2 ? PAL.inkSoft : PAL.teal, 0.94), [0, 0.005, 0], [Math.PI / 2, 0, 0], { shadow: false });
          contour.scale.z = 0.78 + ring * 0.015;
        }
        var river = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-3.3, 0.025, 1.9), new THREE.Vector3(-2.25, 0.03, 2.22),
          new THREE.Vector3(-1.0, 0.03, 2.02), new THREE.Vector3(0.1, 0.03, 2.35),
          new THREE.Vector3(1.35, 0.03, 2.02), new THREE.Vector3(3.25, 0.025, 2.15)
        ]);
        K.add(new THREE.TubeGeometry(river, 40, 0.055, 10, false), K.mat.plastic(PAL.teal, 0.9), null, null, { shadow: false });
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
      /* Activity scenes use restrained museum tokens rather than cartoon-like
         figures. They keep the human consequence present without pretending
         a small procedural model can depict a person's identity literally. */
      if (ctx.context === 'activity' && ctx.style !== 'realist') {
        var tokenBody = K.mat.metal(cloth, 0.4);
        var tokenCore = K.mat.plastic(tone, 0.5);
        K.cyl(0.13, 0.18, 0.42, tokenBody, [0, 0.43, 0], null, { parent: g, seg: 28 });
        K.sph(0.105, tokenCore, [0, 0.73, 0], { parent: g });
        K.cyl(0.21, 0.24, 0.055, K.mat.metal(0x5a6268, 0.46), [0, 0.03, 0], null, { parent: g, seg: 32 });
        K.torus(0.205, 0.012, K.mat.neon(cloth, 0.42), [0, 0.075, 0], [Math.PI / 2, 0, 0], { parent: g, shadow: false });
        K.sph(0.028, K.mat.neon(PAL.white, 0.7), [0, 0.43, 0.165], { parent: g, shadow: false });
        if (opts.pos) g.position.set(opts.pos[0], opts.pos[1] || 0, opts.pos[2]);
        if (opts.face != null) g.rotation.y = opts.face;
        if (opts.scale) g.scale.setScalar(opts.scale);
        return g;
      }
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
      if (opts.arrow !== false) {
        var flowRadius = opts.radius == null ? 0.017 : opts.radius;
        var arrowLength = opts.arrowLength == null ? Math.max(0.12, flowRadius * 7) : opts.arrowLength;
        var arrowDirection = curve.getTangentAt(1).normalize();
        var arrowPosition = curve.getPointAt(1).addScaledVector(arrowDirection, -arrowLength / 2);
        var arrow = K.cone(
          opts.arrowRadius == null ? Math.max(0.045, flowRadius * 2.6) : opts.arrowRadius,
          arrowLength,
          tubeMat,
          [arrowPosition.x, arrowPosition.y, arrowPosition.z],
          null,
          { shadow: false, parent: opts.parent }
        );
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDirection);
        arrow.name = 'bfs-flow-arrow';
      }
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
      var rawText = String(text || '');
      var markerOnly = !!opts.marker && !opts.keepText;
      var markerMatch = rawText.match(/^\s*(\d+[A-Z]?)\./i);
      var displayText = markerOnly ? (markerMatch ? markerMatch[1].toUpperCase() : (warn ? '!' : String(K.labels.length + 1))) : rawText;
      var c = document.createElement('canvas');
      var g = c.getContext('2d');
      g.font = markerOnly ? '800 48px "Segoe UI", Verdana, sans-serif' : '700 34px "Segoe UI", Verdana, sans-serif';
      var w = markerOnly ? 72 : Math.ceil(g.measureText(displayText).width) + 44;
      c.width = w; c.height = markerOnly ? 72 : 62;
      g = c.getContext('2d');
      var style = ctx.style || styleFor(ctx.kind);
      var labelLooks = {
        archive: { bg: 'rgba(231,228,220,.98)', border: '#4E5A60', text: '#20262B', radius: 3 },
        garden: { bg: 'rgba(250,246,222,.98)', border: '#237B52', text: '#172A50', radius: 22 },
        maze: { bg: 'rgba(251,249,243,.98)', border: '#596166', text: '#24272C', radius: 11 },
        paper: { bg: 'rgba(255,247,225,.99)', border: '#2658D5', text: '#112457', radius: 1 },
        terrain: { bg: 'rgba(247,229,216,.98)', border: '#76658B', text: '#39334F', radius: 8 }
      };
      var labelLook = labelLooks[style] || labelLooks.maze;
      g.fillStyle = warn ? 'rgba(250,225,218,.99)' : labelLook.bg;
      g.beginPath();
      if (markerOnly) g.arc(w / 2, 36, 33, 0, Math.PI * 2);
      else if (g.roundRect) { g.roundRect(1, 1, w - 2, 60, labelLook.radius); } else { g.rect(1, 1, w - 2, 60); }
      g.fill();
      g.strokeStyle = warn ? '#B3261E' : labelLook.border;
      g.lineWidth = 2;
      g.stroke();
      g.font = markerOnly ? '800 48px "Segoe UI", Verdana, sans-serif' : '700 34px "Segoe UI", Verdana, sans-serif';
      g.fillStyle = warn ? '#8E1D17' : labelLook.text;
      g.textBaseline = 'middle';
      g.textAlign = markerOnly ? 'center' : 'left';
      g.fillText(displayText, markerOnly ? w / 2 : 22, markerOnly ? 38 : 33);
      var tex = new THREE.CanvasTexture(c);
      tex.anisotropy = Math.min(4, (ctx.renderer.capabilities && ctx.renderer.capabilities.getMaxAnisotropy) ? ctx.renderer.capabilities.getMaxAnisotropy() : 2);
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      K.textures.push(tex);
      var mat = K.own(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
      var sp = new THREE.Sprite(mat);
      var mobileLabel = false;
      try { mobileLabel = window.matchMedia && window.matchMedia('(max-width: 760px)').matches; } catch (e) {}
      var hgt = markerOnly ? (mobileLabel ? 0.3 : 0.235) : (mobileLabel ? 0.24 : 0.15);
      var wid = markerOnly ? hgt : Math.min(mobileLabel ? 2.05 : 1.34, hgt * w / 62);
      sp.scale.set(wid, hgt, 1);
      sp.position.set(pos[0], pos[1], pos[2]);
      sp.renderOrder = 60;
      ctx.root.add(sp);
      K.labels.push({
        sprite: sp,
        base: new THREE.Vector3(pos[0], pos[1], pos[2]),
        screenWidth: markerOnly ? (mobileLabel ? 36 : 28) : (mobileLabel ? Math.min(220, Math.max(74, 34 + rawText.length * 8)) : Math.min(190, Math.max(38, 24 + rawText.length * 6.2))),
        screenHeight: markerOnly ? (mobileLabel ? 36 : 28) : (mobileLabel ? 36 : 26)
      });
      return sp;
    };
    /* Keep teaching labels legible from every camera preset. The labels retain
       their authored anchors but stagger vertically when screen-space boxes
       would overlap. This runs from the base positions, so it never drifts. */
    K.resolveLabels = function () {
      if (K.labels.length < 2 || !ctx.camera || !ctx.canvas) return;
      var cw = ctx.canvas.clientWidth || ctx.canvas.width || 1000;
      var ch = ctx.canvas.clientHeight || ctx.canvas.height || 560;
      var narrowLabels = cw <= 760;
      var world = new THREE.Vector3();
      K.labels.forEach(function (label) { label.sprite.position.copy(label.base); });
      for (var pass = 0; pass < (narrowLabels ? 18 : 9); pass++) {
        ctx.root.updateMatrixWorld(true);
        ctx.camera.updateMatrixWorld(true);
        var points = K.labels.map(function (label) {
          label.sprite.getWorldPosition(world);
          var projected = world.clone().project(ctx.camera);
          return { x: (projected.x * 0.5 + 0.5) * cw, y: (-projected.y * 0.5 + 0.5) * ch };
        });
        var changed = false;
        for (var li = 0; li < K.labels.length; li++) {
          var edge = K.labels[li];
          if (points[li].x - edge.screenWidth * 0.5 < 10) { edge.sprite.position.x += 0.18; changed = true; }
          else if (points[li].x + edge.screenWidth * 0.5 > cw - 10) { edge.sprite.position.x -= 0.18; changed = true; }
          if (points[li].y - edge.screenHeight * 0.5 < 10) { edge.sprite.position.y -= 0.12; changed = true; }
          else if (points[li].y + edge.screenHeight * 0.5 > ch - 10) { edge.sprite.position.y += 0.12; changed = true; }
          for (var lj = 0; lj < li; lj++) {
            var a = K.labels[li], b = K.labels[lj];
            var xGap = (a.screenWidth + b.screenWidth) * 0.5 + 8;
            var yGap = (a.screenHeight + b.screenHeight) * 0.5 + 5;
            if (Math.abs(points[li].x - points[lj].x) < xGap && Math.abs(points[li].y - points[lj].y) < yGap) {
              var lift = a.sprite.position.y - a.base.y;
              if (lift < (narrowLabels ? 1.45 : 0.76)) a.sprite.position.y += narrowLabels ? 0.16 : 0.13;
              else a.sprite.position.x += (li % 2 ? 0.18 : -0.18);
              changed = true;
            }
          }
        }
        if (!changed) break;
      }
    };
    /* --- large state title: one readable cue for the current learning move --- */
    K.storyCard = function (number, title, pos, opts) {
      opts = opts || {};
      var accent = opts.color == null ? PAL.teal : opts.color;
      var canvas = document.createElement('canvas');
      canvas.width = 1024; canvas.height = 180;
      var g = canvas.getContext('2d');
      g.clearRect(0, 0, canvas.width, canvas.height);
      g.shadowColor = 'rgba(17,24,39,.28)'; g.shadowBlur = 24; g.shadowOffsetY = 10;
      g.fillStyle = 'rgba(252,253,252,.97)';
      g.beginPath();
      if (g.roundRect) g.roundRect(18, 14, 988, 148, 28); else g.rect(18, 14, 988, 148);
      g.fill();
      g.shadowColor = 'transparent';
      g.fillStyle = '#' + new THREE.Color(accent).getHexString();
      g.beginPath(); g.arc(96, 88, 50, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fff'; g.font = '900 58px "Segoe UI", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(number), 96, 89);
      g.textAlign = 'left';
      g.fillStyle = '#19263c';
      var clean = String(title || '').toUpperCase();
      var fontSize = 43;
      do { g.font = '800 ' + fontSize + 'px "Segoe UI", sans-serif'; fontSize -= 1; }
      while (g.measureText(clean).width > 780 && fontSize >= 30);
      g.fillText(clean, 174, 90);
      g.fillStyle = '#' + new THREE.Color(accent).getHexString(); g.fillRect(174, 116, 180, 8);
      var texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = Math.min(8, (ctx.renderer.capabilities && ctx.renderer.capabilities.getMaxAnisotropy) ? ctx.renderer.capabilities.getMaxAnisotropy() : 4);
      if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
      K.textures.push(texture);
      var material = K.own(new THREE.SpriteMaterial({ map: texture, depthTest: false, transparent: true }));
      var sprite = new THREE.Sprite(material);
      sprite.scale.set(opts.width || 2.65, opts.height || 0.47, 1);
      sprite.position.set(pos[0], pos[1], pos[2]);
      sprite.renderOrder = 80;
      (opts.parent || ctx.root).add(sprite);
      return sprite;
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

  /* ================= WEEK 2: outcomelens - two files, one policy */
  SCENES.outcomelens = function (K, ctx) {
    var THREE = K.THREE;
    var observeLayer = new THREE.Group(); observeLayer.name = 'bfs-outcome-observe'; ctx.root.add(observeLayer);
    var traceLayer = new THREE.Group(); traceLayer.name = 'bfs-outcome-trace'; ctx.root.add(traceLayer);
    var riskLayer = new THREE.Group(); riskLayer.name = 'bfs-outcome-risk'; ctx.root.add(riskLayer);
    var observeFocus = new THREE.Group(); observeFocus.name = 'bfs-outcome-focus-compare'; ctx.root.add(observeFocus);
    var pathFocus = new THREE.Group(); pathFocus.name = 'bfs-outcome-focus-trace'; ctx.root.add(pathFocus);
    var riskFocus = new THREE.Group(); riskFocus.name = 'bfs-outcome-focus-burden'; ctx.root.add(riskFocus);

    function mappedMaterial(texture, colour, roughness, metalness) {
      return K.own(new THREE.MeshStandardMaterial({
        map: texture || null,
        color: colour == null ? 0xffffff : colour,
        roughness: roughness == null ? 0.82 : roughness,
        metalness: metalness == null ? 0.01 : metalness,
        envMapIntensity: 0.58
      }));
    }
    function documentMaterial(label, accent, rows, stamp) {
      var tex = K.texture(640, 420, function (g, w, h) {
        g.fillStyle = '#f7f3e9'; g.fillRect(0, 0, w, h);
        var wash = g.createLinearGradient(0, 0, w, h);
        wash.addColorStop(0, 'rgba(255,255,255,.34)'); wash.addColorStop(1, 'rgba(171,154,125,.08)');
        g.fillStyle = wash; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#c9c0ae'; g.lineWidth = 8; g.strokeRect(16, 16, w - 32, h - 32);
        g.fillStyle = accent; g.fillRect(28, 28, 18, h - 56);
        g.fillStyle = '#222a32'; g.font = '700 ' + (label.length > 20 ? 25 : label.length > 15 ? 32 : 42) + 'px Segoe UI, sans-serif'; g.fillText(label, 74, 78);
        g.fillStyle = '#5c6268'; g.font = '600 20px Segoe UI, sans-serif';
        var fields = rows || ['CURRENT QUALIFICATIONS', 'CURRENT ANSWERS', 'IDENTITY VERIFIED', 'REVIEW READY'];
        for (var i = 0; i < fields.length; i++) {
          var y = 132 + i * 57;
          g.fillStyle = '#e7e0d3'; g.fillRect(74, y - 24, w - 130, 34);
          g.fillStyle = '#48505a'; g.fillText(fields[i], 88, y);
          g.strokeStyle = '#59616a'; g.lineWidth = 4; g.strokeRect(w - 84, y - 23, 27, 27);
          g.beginPath(); g.moveTo(w - 79, y - 9); g.lineTo(w - 70, y); g.lineTo(w - 57, y - 18); g.stroke();
        }
        if (stamp) {
          g.save(); g.translate(w - 154, h - 62); g.rotate(-0.1);
          g.strokeStyle = accent; g.lineWidth = 6; g.strokeRect(-90, -30, 180, 54);
          g.fillStyle = accent; g.font = '800 24px Segoe UI, sans-serif'; g.textAlign = 'center'; g.fillText(stamp, 0, 7);
          g.restore();
        }
      });
      return mappedMaterial(tex, 0xffffff, 0.92, 0);
    }
    function horizontalSheet(w, d, mat, pos, parent, rotation) {
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, rotation || 0, 0], { parent: parent, shadow: false });
    }
    function softShadow(w, d, pos, opacity, parent) {
      var mat = K.own(new THREE.MeshBasicMaterial({ color: 0x111820, transparent: true, opacity: opacity || 0.14, depthWrite: false }));
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, 0, 0], { parent: parent, shadow: false });
    }

    /* A full records desk replaces the former pedestal and miniature forum. */
    var deskTex = K.texture(768, 512, function (g, w, h) {
      var grad = g.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#82776a'); grad.addColorStop(0.48, '#6d645b'); grad.addColorStop(1, '#514b46');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.22;
      for (var y = 7; y < h; y += 13) {
        g.strokeStyle = y % 26 ? '#a69a8c' : '#352f2b'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(0, y + Math.sin(y * 0.17) * 2);
        g.bezierCurveTo(w * 0.28, y - 4, w * 0.72, y + 5, w, y - 1); g.stroke();
      }
      g.globalAlpha = 0.08;
      for (var n = 0; n < 900; n++) {
        var px = (n * 83) % w, py = (n * 197) % h;
        g.fillStyle = n % 3 ? '#fff' : '#000'; g.fillRect(px, py, 1, 1);
      }
    });
    var deskMat = mappedMaterial(deskTex, 0xffffff, 0.7, 0.02);
    K.rbox(7.7, 0.24, 4.85, deskMat, [0, -0.12, 0], null, { r: 0.08 });
    K.rbox(7.78, 0.09, 4.93, K.mat.metal(0x34383b, 0.55), [0, -0.27, 0], null, { r: 0.07 });
    K.box(8.2, 4.0, 0.12, K.mat.plastic(0xc8c4bc, 0.96), [0, 1.72, -2.52]);
    K.box(8.0, 0.04, 0.09, K.mat.metal(0x676b6d, 0.72), [0, 0.23, -2.43]);

    var paperA = documentMaterial('FILE A', '#31586f');
    var paperB = documentMaterial('FILE B', '#8a6b3f');
    var manila = K.mat.plastic(0xb99b67, 0.9);
    function caseFolder(x, z, mat, tabLeft) {
      var group = new THREE.Group(); group.name = tabLeft ? 'bfs-current-file-a' : 'bfs-current-file-b'; ctx.root.add(group);
      softShadow(1.82, 1.18, [x + 0.04, 0.018, z + 0.05], 0.18, group);
      K.rbox(1.9, 0.065, 1.24, manila, [x, 0.055, z], null, { parent: group, r: 0.025 });
      K.rbox(0.65, 0.055, 0.2, manila, [x + (tabLeft ? -0.53 : 0.53), 0.096, z - 0.61], null, { parent: group, r: 0.018 });
      horizontalSheet(1.66, 1.02, mat, [x, 0.096, z + 0.03], group, tabLeft ? -0.018 : 0.018);
      K.rbox(0.24, 0.025, 0.055, K.mat.metal(0x9ea4a6, 0.34), [x + 0.56, 0.122, z - 0.38], null, { parent: group, r: 0.012 });
      return group;
    }
    caseFolder(-2.62, -0.82, paperA, true);
    caseFolder(-2.62, 0.84, paperB, false);

    /* One physical policy sheet governs both files. */
    var policyMat = documentMaterial('FICTIONAL TEACHING EXAMPLE', '#363d45', ['SAME WRITTEN RULE', 'SAME CURRENT EVIDENCE', 'COMPARE THE OUTCOMES'], 'MECHANISM ONLY');
    softShadow(2.25, 0.52, [-0.7, 0.02, -1.66], 0.2);
    K.rbox(2.28, 0.18, 0.68, K.mat.metal(0x3b4044, 0.42), [-0.72, 0.12, -1.62], null, { r: 0.055 });
    K.add(new THREE.PlaneGeometry(2.1, 1.26), policyMat, [-0.72, 1.03, -1.69], [0, 0, 0], { shadow: false });
    K.rbox(2.22, 1.39, 0.08, K.mat.metal(0x4b5053, 0.48), [-0.72, 1.04, -1.76], null, { r: 0.04 });
    /* Re-add the policy face in front of its frame. */
    K.add(new THREE.PlaneGeometry(2.08, 1.24), policyMat, [-0.72, 1.04, -1.715], [0, 0, 0], { shadow: false });

    /* A restrained scanner makes the common decision procedure tangible. */
    var scanner = new THREE.Group(); scanner.name = 'bfs-policy-scanner'; ctx.root.add(scanner); scanner.position.set(-0.55, 0, 0.06);
    softShadow(1.48, 2.6, [0.04, 0.018, 0.06], 0.22, scanner);
    K.rbox(1.34, 0.54, 2.36, K.mat.metal(0x30363b, 0.32), [0, 0.29, 0], null, { parent: scanner, r: 0.11 });
    K.rbox(1.15, 0.09, 2.06, K.mat.glass(0x9fb1b5, 0.42), [0, 0.59, 0], null, { parent: scanner, r: 0.055 });
    K.rbox(0.94, 0.025, 1.84, K.mat.plastic(0x151a1e, 0.52), [0, 0.647, 0], null, { parent: scanner, r: 0.025 });
    K.rbox(0.24, 0.12, 0.54, K.mat.plastic(0xd2d0c9, 0.72), [0.51, 0.66, -0.58], null, { parent: scanner, r: 0.025 });
    K.cyl(0.035, 0.035, 0.018, K.mat.neon(0x6fa98a, 0.26), [0.51, 0.735, -0.7], null, { parent: scanner, seg: 18, shadow: false });

    /* Two output trays share a chassis but remain visibly separate. */
    function outputTray(z) {
      var tray = new THREE.Group(); ctx.root.add(tray); tray.position.set(2.35, 0, z);
      softShadow(2.25, 1.08, [0.04, 0.018, 0.04], 0.2, tray);
      K.rbox(2.18, 0.09, 1.02, K.mat.metal(0x565c60, 0.5), [0, 0.08, 0], null, { parent: tray, r: 0.045 });
      K.rbox(0.08, 0.27, 1.02, K.mat.metal(0x4a5054, 0.48), [-1.05, 0.18, 0], null, { parent: tray, r: 0.025 });
      K.rbox(0.08, 0.27, 1.02, K.mat.metal(0x4a5054, 0.48), [1.05, 0.18, 0], null, { parent: tray, r: 0.025 });
      return tray;
    }
    outputTray(-0.82); outputTray(0.84);

    var pendingMat = documentMaterial('OUTPUT HELD', '#6d7378', ['COMPARE CURRENT FILES', 'TRACE THE DATA PATH'], 'NOT YET SHOWN');
    horizontalSheet(1.74, 0.78, pendingMat, [2.34, 0.155, -0.82], observeLayer);
    horizontalSheet(1.74, 0.78, pendingMat, [2.34, 0.155, 0.84], observeLayer);
    K.storyCard(1, 'Compare the files today', [0.25, 2.7, 0.72], { color: PAL.teal, parent: observeFocus });
    K.flow([[-1.7, 0.26, -0.82], [-1.15, 0.48, -0.5], [-0.55, 0.68, -0.32]], { color: 0x287b82, pulseColor: PAL.teal, radius: 0.03, pulses: 3, speed: 0.13, parent: observeFocus });
    K.flow([[-1.7, 0.26, 0.84], [-1.14, 0.48, 0.52], [-0.55, 0.68, 0.34]], { color: 0x287b82, pulseColor: PAL.teal, radius: 0.03, pulses: 3, speed: 0.13, parent: observeFocus });
    K.flow([[0.12, 0.48, -0.3], [0.88, 0.28, -0.7], [1.38, 0.19, -0.82]], { color: 0x287b82, pulseColor: PAL.teal, radius: 0.025, pulses: 2, speed: 0.11, parent: observeFocus });
    K.flow([[0.12, 0.48, 0.3], [0.88, 0.28, 0.7], [1.38, 0.19, 0.84]], { color: 0x287b82, pulseColor: PAL.teal, radius: 0.025, pulses: 2, speed: 0.11, parent: observeFocus });

    /* Trace mode reveals the inherited record and the two dispositions. */
    var archive = new THREE.Group(); archive.name = 'bfs-linked-archive'; traceLayer.add(archive); archive.position.set(-2.72, 0, -1.78);
    K.rbox(1.48, 1.42, 0.78, K.mat.metal(0x3c444a, 0.38), [0, 0.72, 0], null, { parent: archive, r: 0.07 });
    for (var drawer = 0; drawer < 3; drawer++) {
      K.rbox(1.22, 0.29, 0.08, K.mat.metal(drawer === 1 ? 0x737b80 : 0x596167, 0.46), [0, 0.34 + drawer * 0.39, 0.43], null, { parent: archive, r: 0.025 });
      K.rbox(0.32, 0.06, 0.05, K.mat.metal(0xb4b7b6, 0.28), [0, 0.34 + drawer * 0.39, 0.49], null, { parent: archive, r: 0.014 });
    }
    var flagMat = documentMaterial('DISPUTED FLAG', '#a3261c', ['OLDER LINKED RECORD', 'PROVENANCE UNCLEAR'], 'REVIEW');
    horizontalSheet(1.15, 0.7, flagMat, [-2.33, 0.4, -1.26], traceLayer, -0.08);
    function route(points, colour, width) {
      var curve = new THREE.CatmullRomCurve3(points.map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); }));
      var material = K.mat.plastic(colour, 0.58);
      var tube = K.add(new THREE.TubeGeometry(curve, 36, width || 0.024, 8, false), material, null, null, { parent: traceLayer, shadow: false });
      tube.name = 'bfs-physical-record-route';
      var tangent = curve.getTangentAt(1).normalize();
      var endpoint = curve.getPointAt(1).addScaledVector(tangent, -0.11);
      var arrow = K.cone((width || 0.024) * 2.8, 0.2, material, [endpoint.x, endpoint.y, endpoint.z], null, { parent: traceLayer, shadow: false });
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
    }
    route([[-2.38, 0.24, -1.22], [-2.02, 0.28, -0.92], [-1.58, 0.42, -0.72], [-1.18, 0.59, -0.5]], 0xa3261c, 0.034);
    route([[-1.72, 0.17, 0.84], [-1.3, 0.34, 0.74], [-1.06, 0.54, 0.48]], 0x52636e, 0.023);
    route([[0.14, 0.4, -0.57], [0.82, 0.25, -0.75], [1.26, 0.18, -0.82]], 0x476b57, 0.025);
    route([[0.14, 0.4, 0.57], [0.72, 0.3, 0.7], [1.26, 0.18, 0.84]], 0x9a4b3e, 0.034);
    var clearedMat = documentMaterial('CLEARED', '#34684a', ['CURRENT EVIDENCE USED', 'DIRECT DISPOSITION'], 'COMPLETE');
    var reviewMat = documentMaterial('REVIEW / DELAY', '#a3261c', ['HISTORICAL FLAG USED', 'MORE PROOF REQUESTED'], 'HOLD');
    horizontalSheet(1.74, 0.78, clearedMat, [2.34, 0.16, -0.82], traceLayer);
    horizontalSheet(1.74, 0.78, reviewMat, [2.34, 0.16, 0.84], traceLayer);
    K.storyCard(2, 'Trace what enters the rule', [0.55, 2.7, 0.72], { color: PAL.orange, parent: pathFocus });
    K.halo(0.62, PAL.orange, [-2.7, 0.06, -1.77], { spin: 0.34, tube: 0.018, parent: pathFocus });
    K.halo(0.7, PAL.red, [2.33, 0.08, 0.84], { spin: 0.48, tube: 0.018, parent: pathFocus });

    /* Risk mode adds the concrete administrative burden; it does not add invented people or statistics. */
    var proofMat = documentMaterial('PROOF REQUEST', '#9a4b3e', ['SUPPLY NEW DOCUMENTS', 'WAIT FOR REVIEW'], 'ACTION');
    horizontalSheet(1.34, 0.72, proofMat, [2.08, 0.225, 1.24], riskLayer, -0.05);
    var appealMat = documentMaterial('APPEAL TICKET', '#a3261c', ['CASE RETURNED', 'REVIEW QUEUE'], 'OPEN');
    horizontalSheet(1.2, 0.62, appealMat, [2.72, 0.295, 1.04], riskLayer, 0.07);
    /* Delay clock uses form as well as colour, so it survives grayscale. */
    K.cyl(0.39, 0.39, 0.075, K.mat.metal(0x4c5357, 0.42), [1.18, 0.48, 1.36], [Math.PI / 2, 0, 0], { parent: riskLayer, seg: 48 });
    var clockMat = K.screen(64, 64, function (g, w, h) {
      g.fillStyle = '#eee9dd'; g.beginPath(); g.arc(32, 32, 29, 0, Math.PI * 2); g.fill();
      g.strokeStyle = '#353a3e'; g.lineWidth = 2; g.stroke();
      for (var tick = 0; tick < 12; tick++) {
        var angle = tick / 12 * Math.PI * 2 - Math.PI / 2;
        g.beginPath(); g.moveTo(32 + Math.cos(angle) * 22, 32 + Math.sin(angle) * 22); g.lineTo(32 + Math.cos(angle) * 26, 32 + Math.sin(angle) * 26); g.stroke();
      }
      g.lineWidth = 3; g.beginPath(); g.moveTo(32, 32); g.lineTo(22, 20); g.stroke();
      g.strokeStyle = '#a3261c'; g.lineWidth = 2; g.beginPath(); g.moveTo(32, 32); g.lineTo(46, 27); g.stroke();
      g.fillStyle = '#353a3e'; g.beginPath(); g.arc(32, 32, 3, 0, Math.PI * 2); g.fill();
    }, { glow: 0.02 });
    K.add(new THREE.PlaneGeometry(0.66, 0.66), clockMat, [1.18, 0.48, 1.404], null, { parent: riskLayer, shadow: false });
    /* Linked copies make the correction problem visible without a glowing network. */
    for (var copy = 0; copy < 3; copy++) {
      K.rbox(0.72, 0.035, 0.5, K.mat.plastic(copy === 2 ? 0xf0d5d0 : 0xe7e2d8, 0.93), [3.18 - copy * 0.11, 0.24 + copy * 0.055, 1.48 - copy * 0.06], [0, -0.1 + copy * 0.035, 0], { parent: riskLayer, r: 0.018 });
      K.rbox(0.48, 0.012, 0.025, K.mat.plastic(copy === 2 ? 0xa3261c : 0x73797d, 0.7), [3.18 - copy * 0.11, 0.267 + copy * 0.055, 1.48 - copy * 0.06], null, { parent: riskLayer, r: 0.006, shadow: false });
    }
    K.storyCard(3, 'Inspect the added burden', [1.0, 2.7, 0.72], { color: PAL.red, parent: riskFocus });
    K.halo(0.7, PAL.red, [1.88, 0.08, 1.22], { spin: 0.72, tube: 0.026, parent: riskFocus });
    K.flow([[2.34, 0.3, 0.84], [1.95, 0.55, 1.12], [1.3, 0.52, 1.34]], { color: PAL.red, pulseColor: PAL.red, radius: 0.035, pulses: 4, speed: 0.16, parent: riskFocus });

    function setMode(mode) {
      mode = mode === 'path' || mode === 'risk' ? mode : 'observe';
      observeLayer.visible = mode === 'observe';
      traceLayer.visible = mode === 'path' || mode === 'risk';
      riskLayer.visible = mode === 'risk';
      observeFocus.visible = mode === 'observe';
      pathFocus.visible = mode === 'path';
      riskFocus.visible = mode === 'risk';
      scanner.visible = true;
    }
    setMode(ctx.view);
    return {
      setMode: setMode,
      cameraFor: function (mode, narrow) {
        if (narrow) {
          if (mode === 'risk') return { cam: [3.2, 2.55, 4.25], look: [1.12, 0.32, 0.72] };
          if (mode === 'path') return { cam: [3.85, 3.15, 5.2], look: [-0.05, 0.32, 0] };
          return { cam: [3.9, 3.25, 5.35], look: [-0.12, 0.32, 0] };
        }
        if (mode === 'risk') return { cam: [4.25, 2.8, 5.25], look: [1.18, 0.18, 0.68] };
        if (mode === 'path') return { cam: [4.7, 3.45, 6.2], look: [-0.08, 0.14, 0] };
        return { cam: [4.85, 3.65, 6.45], look: [-0.02, 0.1, 0] };
      }
    };
  };
  ANCHORS.outcomelens = [[-2.62, 0.12, 0], [-1.9, 0.42, -0.72], [2.22, 0.36, 0.98]];

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
      { a: 0, err: 0.06, badCount: 1, label: 'LM' }, { a: Math.PI / 2, err: 0.12, badCount: 3, label: 'LW' },
      { a: Math.PI, err: 0.08, badCount: 2, label: 'DM' }, { a: -Math.PI / 2, err: 0.35, badCount: 6, label: 'DW' }
    ];
    var tileOrder = [10, 5, 15, 0, 7, 12, 3, 9, 2, 14, 4, 11, 1, 8, 6, 13];
    groups.forEach(function (gr, gi) {
      var gx = Math.cos(gr.a) * 0.72, gz = Math.sin(gr.a) * 0.72;
      var worst = gi === 3;
      var trayMat = K.screen(40, 40, function (g, w, h) {
        g.fillStyle = worst ? '#fdf0ee' : '#f2f7fa'; g.fillRect(0, 0, w, h);
        for (var yy = 0; yy < 4; yy++) for (var xx = 0; xx < 4; xx++) {
          var tile = yy * 4 + xx;
          var bad = tileOrder.indexOf((tile + gi * 4) % 16) < gr.badCount;
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
    var avg = K.add(new K.THREE.PlaneGeometry(1.15, 0.62), K.screen(84, 32, function (g, w, h) {
      g.fillStyle = '#0d1526'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1c7a43'; g.font = 'bold 8.2px monospace'; g.fillText('OVERALL VIEW', w * 0.08, h * 0.34);
      g.fillStyle = '#8ba0b4'; g.font = '5.2px monospace'; g.fillText('CAN HIDE A GROUP', w * 0.08, h * 0.58);
      g.fillStyle = '#da291c'; g.font = 'bold 6.2px monospace'; g.fillText('34.7% ERROR', w * 0.08, h * 0.84);
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

  /* =========== WEEK 9: benevolence - inspect a fictional shelter intake */
  SCENES.benevolence = function (K, ctx) {
    var THREE = K.THREE;
    var promiseLayer = new THREE.Group(); promiseLayer.name = 'bfs-benevolence-read-promise'; ctx.root.add(promiseLayer);
    var mechanismLayer = new THREE.Group(); mechanismLayer.name = 'bfs-benevolence-inspect-mechanism'; ctx.root.add(mechanismLayer);
    var testLayer = new THREE.Group(); testLayer.name = 'bfs-benevolence-run-test'; ctx.root.add(testLayer);
    var promiseFocus = new THREE.Group(); promiseFocus.name = 'bfs-benevolence-focus-promise'; ctx.root.add(promiseFocus);
    var mechanismFocus = new THREE.Group(); mechanismFocus.name = 'bfs-benevolence-focus-mechanism'; ctx.root.add(mechanismFocus);
    var testFocus = new THREE.Group(); testFocus.name = 'bfs-benevolence-focus-test'; ctx.root.add(testFocus);

    function paper(label, accent, rows, footer, tone) {
      return K.screen(100, 72, function (g, w, h) {
        g.fillStyle = tone || '#f7f3e9'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#bdb7aa'; g.lineWidth = 1.2; g.strokeRect(2, 2, w - 4, h - 4);
        g.fillStyle = accent; g.fillRect(5, 5, 3, h - 10);
        g.fillStyle = '#263038'; g.font = '700 ' + (label.length > 23 ? 5.1 : 6.2) + 'px Segoe UI, sans-serif';
        g.fillText(label, 12, 13);
        g.font = '600 3.8px Segoe UI, sans-serif';
        (rows || []).forEach(function (row, i) {
          var y = 24 + i * 11;
          g.fillStyle = '#e5dfd2'; g.fillRect(12, y - 5, 80, 7);
          g.fillStyle = '#495159'; g.fillText(row, 15, y);
        });
        if (footer) {
          g.fillStyle = accent; g.font = '800 3.6px Segoe UI, sans-serif';
          g.fillText(footer, 12, 66);
        }
      }, { glow: 0.02 });
    }
    function verticalSheet(w, h, mat, pos, parent) {
      return K.add(new THREE.PlaneGeometry(w, h), mat, pos, null, { parent: parent, shadow: false });
    }
    function horizontalSheet(w, d, mat, pos, parent, turn) {
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, turn || 0, 0], { parent: parent, shadow: false });
    }
    function floorShadow(w, d, pos, parent) {
      var mat = K.own(new THREE.MeshBasicMaterial({ color: 0x202326, transparent: true, opacity: 0.14, depthWrite: false }));
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, 0, 0], { parent: parent, shadow: false });
    }
    function arrowStrip(a, b, colour, parent) {
      var dx = b[0] - a[0], dz = b[2] - a[2];
      var length = Math.sqrt(dx * dx + dz * dz);
      var angle = -Math.atan2(dz, dx);
      K.box(length, 0.018, 0.045, K.mat.plastic(colour, 0.76), [(a[0] + b[0]) / 2, a[1], (a[2] + b[2]) / 2], [0, angle, 0], { parent: parent, shadow: false });
      var head = K.cone(0.085, 0.2, K.mat.plastic(colour, 0.76), [b[0], a[1] + 0.015, b[2]], [0, 0, Math.PI / 2], { parent: parent, seg: 18, shadow: false });
      head.rotation.y = angle;
    }

    /* The room is a recognisable, human-scale lobby, not a display pedestal. */
    var terrazzo = K.texture(640, 420, function (g, w, h) {
      g.fillStyle = '#c9c5bc'; g.fillRect(0, 0, w, h);
      var chips = ['#8d8b85', '#e4dfd4', '#9e8170', '#6d7778'];
      for (var i = 0; i < 760; i++) {
        g.fillStyle = chips[i % chips.length];
        var x = (i * 83) % w, y = (i * 197) % h, r = 1 + (i % 4);
        g.fillRect(x, y, r, i % 3 ? 2 : 3);
      }
      g.strokeStyle = 'rgba(84,82,78,.22)'; g.lineWidth = 2;
      for (var gx = 0; gx < w; gx += 128) { g.beginPath(); g.moveTo(gx, 0); g.lineTo(gx, h); g.stroke(); }
      for (var gy = 0; gy < h; gy += 105) { g.beginPath(); g.moveTo(0, gy); g.lineTo(w, gy); g.stroke(); }
    });
    var floorMat = K.own(new THREE.MeshStandardMaterial({ map: terrazzo, roughness: 0.82, metalness: 0.01, envMapIntensity: 0.48 }));
    K.rbox(7.8, 0.2, 4.9, floorMat, [0, -0.12, 0], null, { r: 0.07 });
    K.box(8.1, 3.8, 0.14, K.mat.plastic(0xd7d2c8, 0.96), [0, 1.75, -2.5]);
    K.box(0.14, 3.8, 5.0, K.mat.plastic(0xc7c1b6, 0.96), [-3.92, 1.75, 0]);
    K.box(8.0, 0.08, 0.08, K.mat.metal(0x656968, 0.72), [0, 0.13, -2.39]);

    /* A conspicuous boundary label prevents the model from masquerading as a case report. */
    var boundaryMat = paper('FICTIONAL TEACHING EXAMPLE', '#8a3028', ['SHELTER INTAKE LOBBY', 'NO REAL SERVICE OR OUTCOME'], 'INSPECT THE MECHANISM. DO NOT INFER RESULTS');
    K.rbox(3.08, 1.22, 0.07, K.mat.metal(0x505456, 0.55), [1.85, 1.91, -2.38], null, { r: 0.035 });
    verticalSheet(2.92, 1.06, boundaryMat, [1.85, 1.91, -2.29]);

    /* Reception counter, privacy screen, waiting bench, and entrance establish scale. */
    floorShadow(4.4, 1.62, [0.88, 0.01, -0.76]);
    K.rbox(4.35, 0.82, 1.48, K.mat.plastic(0x827565, 0.76), [0.86, 0.41, -0.82], null, { r: 0.075 });
    K.rbox(4.45, 0.12, 1.58, K.mat.plastic(0xb6aa98, 0.58), [0.86, 0.88, -0.82], null, { r: 0.055 });
    K.rbox(1.08, 0.84, 0.055, K.mat.glass(0xa9bcc0, 0.28), [0.45, 1.34, -0.06], null, { r: 0.025 });
    K.rbox(0.88, 0.08, 0.22, K.mat.metal(0x565b5e, 0.48), [0.45, 0.95, -0.08], null, { r: 0.025 });
    var bench = new THREE.Group(); bench.name = 'bfs-fictional-lobby-bench'; ctx.root.add(bench); bench.position.set(-2.72, 0, 0.92);
    floorShadow(1.85, 0.82, [0.02, 0.01, 0.05], bench);
    K.rbox(1.82, 0.16, 0.72, K.mat.plastic(0x6a7778, 0.72), [0, 0.44, 0], null, { parent: bench, r: 0.08 });
    K.rbox(1.82, 0.67, 0.13, K.mat.plastic(0x586768, 0.75), [0, 0.78, -0.31], [-0.12, 0, 0], { parent: bench, r: 0.055 });
    [-0.68, 0.68].forEach(function (x2) { K.cyl(0.045, 0.055, 0.42, K.mat.metal(0x555b5d, 0.58), [x2, 0.22, 0], null, { parent: bench, seg: 20 }); });
    K.rbox(1.62, 2.75, 0.1, K.mat.metal(0x4e5558, 0.55), [-2.88, 1.51, -2.37], null, { r: 0.035 });
    K.rbox(1.48, 2.6, 0.045, K.mat.glass(0xb8c8ca, 0.3), [-2.88, 1.51, -2.305], null, { r: 0.02 });
    K.rbox(0.1, 0.12, 0.08, K.mat.metal(0x777b7b, 0.4), [-2.22, 1.52, -2.25], null, { r: 0.025 });

    /* Read promise: the public message and blank intake sheet are all that is foregrounded. */
    var promiseMat = paper('WELCOME', '#276c69', ['PRIVATE INTAKE', 'RESPECTFUL SUPPORT', 'ASK BEFORE SHARING'], 'FICTIONAL PROMISE. NOT EVIDENCE OF PRACTICE');
    K.rbox(2.02, 1.48, 0.07, K.mat.metal(0x4f5557, 0.56), [-1.35, 1.86, -2.37], null, { r: 0.035 });
    verticalSheet(1.87, 1.32, promiseMat, [-1.35, 1.86, -2.28]);
    var intakeMat = paper('BLANK INTAKE FORM', '#276c69', ['FIELD A', 'FIELD B: OPTIONAL', 'SHARING CHOICE'], 'READ THE PROMISE FIRST');
    horizontalSheet(1.32, 0.96, intakeMat, [-0.47, 0.975, -0.52], promiseLayer, -0.03);
    K.rbox(1.48, 0.065, 1.08, K.mat.plastic(0x51483e, 0.75), [-0.47, 0.92, -0.52], null, { parent: promiseLayer, r: 0.035 });
    K.rbox(0.34, 0.035, 0.085, K.mat.metal(0xa9abad, 0.35), [-0.47, 1.012, -0.95], null, { parent: promiseLayer, r: 0.012 });

    /* Inspect mechanism: matte paper paths reveal questions, never a claimed outcome. */
    var sourceMat = paper('INTAKE COPY', '#52636c', ['FIELDS ENTERED', 'CHOICES RECORDED'], 'FICTIONAL FORM');
    horizontalSheet(1.13, 0.8, sourceMat, [-0.55, 0.985, -0.45], mechanismLayer, -0.03);
    var questionRows = [
      { x: 1.05, z: -0.52, title: 'WHAT IS COLLECTED?', rows: ['NECESSARY?', 'OPTIONAL?'], colour: '#485b66' },
      { x: 2.0, z: -0.52, title: 'WHO CAN SEE IT?', rows: ['ACCESS?', 'REVIEW?'], colour: '#79603f' },
      { x: 2.95, z: -0.52, title: 'HOW LONG KEPT?', rows: ['RETENTION?', 'CORRECTION?'], colour: '#8a3028' }
    ];
    questionRows.forEach(function (q) {
      K.rbox(0.8, 0.055, 0.77, K.mat.plastic(0x4e5355, 0.62), [q.x, 0.955, q.z], null, { parent: mechanismLayer, r: 0.025 });
      horizontalSheet(0.72, 0.66, paper(q.title, q.colour, q.rows, 'QUESTION. NOT A FINDING'), [q.x, 0.992, q.z], mechanismLayer);
    });
    arrowStrip([0.05, 1.005, -0.45], [0.58, 1.005, -0.51], 0x596970, mechanismLayer);
    arrowStrip([1.46, 1.005, -0.52], [1.56, 1.005, -0.52], 0x75644e, mechanismLayer);
    arrowStrip([2.41, 1.005, -0.52], [2.51, 1.005, -0.52], 0x83423b, mechanismLayer);
    /* A lockable paper cabinet represents governance without claiming storage occurs. */
    K.rbox(1.12, 1.55, 0.7, K.mat.metal(0x4b5256, 0.45), [2.93, 0.78, -1.72], null, { parent: mechanismLayer, r: 0.055 });
    [0.32, 0.77, 1.22].forEach(function (y2) {
      K.rbox(0.92, 0.31, 0.06, K.mat.metal(0x697074, 0.52), [2.93, y2, -1.33], null, { parent: mechanismLayer, r: 0.018 });
      K.rbox(0.25, 0.05, 0.04, K.mat.metal(0xb0b2b0, 0.3), [2.93, y2, -1.29], null, { parent: mechanismLayer, r: 0.01 });
    });
    verticalSheet(0.72, 0.35, paper('GOVERNANCE QUESTIONS', '#8a3028', [], 'ACCESS • RETENTION • CORRECTION'), [2.93, 1.76, -1.31], mechanismLayer);

    /* Run the benevolence test: concrete question cards separate promise from proof. */
    var testBoard = new THREE.Group(); testBoard.name = 'bfs-benevolence-question-board'; testLayer.add(testBoard); testBoard.position.set(-2.35, 0, 1.18);
    floorShadow(2.45, 1.2, [0, 0.01, 0], testBoard);
    K.rbox(2.38, 0.62, 1.15, K.mat.plastic(0x756957, 0.74), [0, 0.31, 0], null, { parent: testBoard, r: 0.065 });
    K.rbox(2.48, 0.1, 1.24, K.mat.plastic(0xb8ad99, 0.58), [0, 0.67, 0], null, { parent: testBoard, r: 0.045 });
    var tests = [
      { x: -0.76, title: 'CAN SOMEONE REFUSE?', colour: '#485b66' },
      { x: 0, title: 'DOES REFUSAL CHANGE ACCESS?', colour: '#8a3028' },
      { x: 0.76, title: 'WHO CAN CORRECT IT?', colour: '#79603f' }
    ];
    tests.forEach(function (q2, qi) {
      horizontalSheet(0.68, 0.86, paper(q2.title, q2.colour, ['LOOK FOR EVIDENCE'], 'NO ANSWER IS INVENTED'), [q2.x, 0.745 + qi * 0.012, 0], testBoard, qi === 1 ? 0 : (qi ? 0.04 : -0.04));
    });
    var testSignMat = paper('BENEVOLENCE TEST', '#8a3028', ['PROMISE IS NOT PROOF', 'INSPECT EFFECTS AND POWER'], 'FICTIONAL TEACHING EXAMPLE');
    K.rbox(2.35, 1.12, 0.07, K.mat.metal(0x525759, 0.54), [0.3, 1.85, -2.31], null, { parent: testLayer, r: 0.035 });
    verticalSheet(2.2, 0.96, testSignMat, [0.3, 1.85, -2.22], testLayer);
    K.storyCard(1, 'Read the public promise', [0.2, 3.12, 0.75], { color: PAL.teal, parent: promiseFocus });
    K.flow([[-2.75, 0.16, -1.72], [-2.0, 0.28, -1.35], [-1.32, 0.72, -1.1]], { color: 0x287b82, pulseColor: PAL.teal, radius: 0.028, pulses: 3, speed: 0.1, parent: promiseFocus });
    K.halo(0.72, PAL.teal, [-1.35, 0.06, -1.75], { spin: 0.28, tube: 0.018, parent: promiseFocus });
    K.storyCard(2, 'Expose the intake mechanism', [0.7, 3.12, 0.75], { color: PAL.orange, parent: mechanismFocus });
    K.flow([[-0.35, 1.05, -0.45], [0.8, 1.13, -0.5], [1.95, 1.12, -0.52], [2.92, 1.12, -1.46]], { color: PAL.orange, pulseColor: PAL.orange, radius: 0.032, pulses: 5, speed: 0.12, parent: mechanismFocus });
    K.halo(0.62, PAL.orange, [2.93, 0.06, -1.72], { spin: 0.46, tube: 0.018, parent: mechanismFocus });
    K.storyCard(3, 'Test burden and decision power', [0.25, 3.12, 0.75], { color: PAL.red, parent: testFocus });
    var lens = new THREE.Group(); lens.name = 'bfs-benevolence-inspection-lens'; testFocus.add(lens); lens.position.set(-2.32, 1.24, 1.18); lens.rotation.set(-0.42, 0.22, -0.12);
    K.torus(0.62, 0.075, K.mat.metal(0x8b633e, 0.3), [0, 0, 0], null, { parent: lens, shadow: false });
    K.add(new THREE.CircleGeometry(0.54, 48), K.mat.glass(0xcbe8eb, 0.22), [0, 0, -0.015], null, { parent: lens, shadow: false });
    K.cyl(0.07, 0.085, 0.92, K.mat.plastic(0x6f4b31, 0.56), [0.62, -0.62, 0], [0, 0, -0.78], { parent: lens, seg: 28 });
    K.halo(0.85, PAL.red, [-2.35, 0.08, 1.18], { spin: 0.55, tube: 0.022, parent: testFocus });

    function setMode(mode) {
      mode = mode === 'path' || mode === 'risk' ? mode : 'observe';
      promiseLayer.visible = mode === 'observe';
      mechanismLayer.visible = mode === 'path' || mode === 'risk';
      testLayer.visible = mode === 'risk';
      promiseFocus.visible = mode === 'observe';
      mechanismFocus.visible = mode === 'path';
      testFocus.visible = mode === 'risk';
    }
    setMode(ctx.view);
    return {
      setMode: setMode,
      cameraFor: function (mode, narrow) {
        if (narrow) {
          if (mode === 'risk') return { cam: [3.85, 2.9, 5.15], look: [-0.4, 0.72, 0.0] };
          if (mode === 'path') return { cam: [3.85, 2.8, 5.0], look: [0.38, 0.82, -0.52] };
          return { cam: [3.8, 2.95, 5.1], look: [-0.3, 0.82, -0.45] };
        }
        if (mode === 'risk') return { cam: [4.65, 3.0, 5.65], look: [-0.35, 0.65, -0.08] };
        if (mode === 'path') return { cam: [4.55, 2.85, 5.45], look: [0.45, 0.77, -0.56] };
        return { cam: [4.55, 3.05, 5.65], look: [-0.28, 0.78, -0.45] };
      }
    };
  };
  ANCHORS.benevolence = [[-1.35, 1.86, -2.32], [1.9, 1.0, -0.52], [-2.35, 0.76, 1.18]];

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

  /* ============= WEEK 11: repair - authority moves across a co-design studio */
  SCENES.repair = function (K, ctx) {
    var THREE = K.THREE;
    var harmLayer = new THREE.Group(); harmLayer.name = 'bfs-repair-document-harm'; ctx.root.add(harmLayer);
    var patchLayer = new THREE.Group(); patchLayer.name = 'bfs-repair-apply-patch'; ctx.root.add(patchLayer);
    var shiftLayer = new THREE.Group(); shiftLayer.name = 'bfs-repair-shift-power'; ctx.root.add(shiftLayer);
    var ownerArtifacts = new THREE.Group(); ownerArtifacts.name = 'bfs-repair-owner-authority'; ctx.root.add(ownerArtifacts);
    var harmFocus = new THREE.Group(); harmFocus.name = 'bfs-repair-focus-harm'; ctx.root.add(harmFocus);
    var patchFocus = new THREE.Group(); patchFocus.name = 'bfs-repair-focus-patch'; ctx.root.add(patchFocus);
    var shiftFocus = new THREE.Group(); shiftFocus.name = 'bfs-repair-focus-shift'; ctx.root.add(shiftFocus);

    function paper(label, accent, rows, footer, tone) {
      return K.screen(104, 74, function (g, w, h) {
        g.fillStyle = tone || '#f5f1e7'; g.fillRect(0, 0, w, h);
        g.strokeStyle = '#b8b1a3'; g.lineWidth = 1.1; g.strokeRect(2, 2, w - 4, h - 4);
        g.fillStyle = accent; g.fillRect(5, 5, 3, h - 10);
        g.fillStyle = '#283038'; g.font = '700 ' + (label.length > 24 ? 5 : 6.2) + 'px Segoe UI, sans-serif'; g.fillText(label, 12, 13);
        g.font = '600 3.7px Segoe UI, sans-serif';
        (rows || []).forEach(function (row, i) {
          var y = 24 + i * 11;
          g.fillStyle = '#e4ded1'; g.fillRect(12, y - 5, 84, 7);
          g.fillStyle = '#485159'; g.fillText(row, 15, y);
        });
        if (footer) {
          g.fillStyle = accent; g.font = '800 3.6px Segoe UI, sans-serif';
          g.fillText(footer, 12, 68);
        }
      }, { glow: 0.02 });
    }
    function horizontalSheet(w, d, mat, pos, parent, turn) {
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, turn || 0, 0], { parent: parent, shadow: false });
    }
    function verticalSheet(w, h, mat, pos, parent) {
      return K.add(new THREE.PlaneGeometry(w, h), mat, pos, null, { parent: parent, shadow: false });
    }
    function floorShadow(w, d, pos, parent) {
      var mat = K.own(new THREE.MeshBasicMaterial({ color: 0x181b1d, transparent: true, opacity: 0.14, depthWrite: false }));
      return K.add(new THREE.PlaneGeometry(w, d), mat, pos, [-Math.PI / 2, 0, 0], { parent: parent, shadow: false });
    }
    function binder(parent, pos, colour, label) {
      var group = new THREE.Group(); group.name = label.toLowerCase().replace(/[^a-z]+/g, '-'); parent.add(group); group.position.set(pos[0], pos[1], pos[2]);
      K.rbox(0.82, 0.11, 0.58, K.mat.plastic(colour, 0.68), [0, 0, 0], null, { parent: group, r: 0.025 });
      K.rbox(0.12, 0.125, 0.58, K.mat.plastic(0x2f3639, 0.74), [-0.35, 0.006, 0], null, { parent: group, r: 0.018 });
      horizontalSheet(0.48, 0.18, paper(label, '#3f5966', [], 'AUTHORITY ARTIFACT'), [0.08, 0.068, 0], group);
      return group;
    }
    function approvalStamp(parent, pos) {
      var group = new THREE.Group(); group.name = 'approval-authority'; parent.add(group); group.position.set(pos[0], pos[1], pos[2]);
      K.rbox(0.38, 0.08, 0.29, K.mat.plastic(0x845d3d, 0.62), [0, 0.04, 0], null, { parent: group, r: 0.035 });
      K.cyl(0.075, 0.095, 0.25, K.mat.plastic(0x5d402d, 0.58), [0, 0.2, 0], null, { parent: group, seg: 24 });
      K.rbox(0.25, 0.08, 0.18, K.mat.plastic(0x4f3527, 0.62), [0, 0.36, 0], null, { parent: group, r: 0.03 });
      return group;
    }
    function materialsTray(parent, pos) {
      var group = new THREE.Group(); group.name = 'design-materials-authority'; parent.add(group); group.position.set(pos[0], pos[1], pos[2]);
      K.rbox(1.02, 0.13, 0.62, K.mat.metal(0x555c5e, 0.54), [0, 0.06, 0], null, { parent: group, r: 0.035 });
      [0x315a6b, 0x92733f, 0x8a3028, 0x65745d].forEach(function (c, i) {
        K.rbox(0.17, 0.045, 0.43, K.mat.plastic(c, 0.72), [-0.33 + i * 0.22, 0.145 + i * 0.008, 0], [0, i % 2 ? 0.04 : -0.04, 0], { parent: group, r: 0.015 });
      });
      return group;
    }

    /* Full studio floor, wall, and worktable establish a plausible working room. */
    var lino = K.texture(640, 420, function (g, w, h) {
      var grad = g.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#a79d8d'); grad.addColorStop(0.5, '#8e867a'); grad.addColorStop(1, '#77716a');
      g.fillStyle = grad; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.16;
      for (var y = 8; y < h; y += 14) {
        g.strokeStyle = y % 28 ? '#d4c8b5' : '#49443f'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(0, y); g.bezierCurveTo(w * 0.25, y - 3, w * 0.72, y + 4, w, y - 1); g.stroke();
      }
      g.globalAlpha = 0.07;
      for (var n = 0; n < 700; n++) { g.fillStyle = n % 2 ? '#fff' : '#000'; g.fillRect((n * 97) % w, (n * 211) % h, 1, 1); }
    });
    var floorMat = K.own(new THREE.MeshStandardMaterial({ map: lino, roughness: 0.82, metalness: 0.01, envMapIntensity: 0.48 }));
    K.rbox(7.8, 0.2, 4.9, floorMat, [0, -0.12, 0], null, { r: 0.07 });
    K.box(8.12, 3.8, 0.14, K.mat.plastic(0xcec8bd, 0.96), [0, 1.75, -2.5]);
    K.box(0.14, 3.8, 5.0, K.mat.plastic(0xc2bbb0, 0.96), [-3.92, 1.75, 0]);
    K.box(8.0, 0.08, 0.08, K.mat.metal(0x606667, 0.72), [0, 0.13, -2.39]);
    var boundaryMat = paper('CONCEPTUAL TEACHING MODEL', '#8a3028', ['COMMUNITY CO-DESIGN STUDIO', 'NO PEOPLE, TESTIMONY OR ENDORSEMENT'], 'WATCH WHERE AGENDA, APPROVAL AND MATERIALS MOVE');
    K.rbox(3.45, 1.25, 0.07, K.mat.metal(0x4e5456, 0.56), [1.75, 2.62, -2.38], null, { r: 0.035 });
    verticalSheet(3.28, 1.08, boundaryMat, [1.75, 2.62, -2.29]);

    floorShadow(5.75, 2.55, [0.22, 0.01, 0.36]);
    K.rbox(5.68, 0.18, 2.48, K.mat.plastic(0xa48460, 0.68), [0.2, 0.72, 0.3], null, { r: 0.085 });
    K.rbox(5.76, 0.07, 2.56, K.mat.plastic(0xd0b58f, 0.55), [0.2, 0.845, 0.3], null, { r: 0.06 });
    [[-2.35, -0.62], [2.75, -0.62], [-2.35, 1.22], [2.75, 1.22]].forEach(function (p) {
      K.cyl(0.065, 0.075, 0.68, K.mat.metal(0x565c5d, 0.56), [p[0], 0.34, p[1]], null, { seg: 24 });
    });

    /* The owner shelf remains visible; its contents actually move in state three. */
    K.rbox(2.55, 0.14, 0.66, K.mat.metal(0x535a5c, 0.52), [-2.48, 1.1, -2.0], null, { r: 0.04 });
    K.rbox(0.12, 1.22, 0.7, K.mat.metal(0x555b5d, 0.58), [-3.69, 1.67, -2.0], null, { r: 0.025 });
    K.rbox(0.12, 1.22, 0.7, K.mat.metal(0x555b5d, 0.58), [-1.27, 1.67, -2.0], null, { r: 0.025 });
    var ownerLabel = paper('OWNER SHELF', '#56636a', ['AGENDA', 'APPROVAL', 'DESIGN MATERIALS'], 'LOCATION SHOWS WHO HOLDS AUTHORITY');
    verticalSheet(2.18, 0.68, ownerLabel, [-2.48, 2.16, -2.31]);
    binder(ownerArtifacts, [-3.15, 1.28, -1.98], 0x315a6b, 'AGENDA');
    approvalStamp(ownerArtifacts, [-2.38, 1.19, -1.94]);
    materialsTray(ownerArtifacts, [-1.75, 1.22, -1.97]);

    /* State one documents harm as inspectable evidence, not as invented testimony. */
    var harmLogMat = paper('DOCUMENTED HARM LOG', '#8a3028', ['INTERACTION + BARRIER', 'EVIDENCE AVAILABLE', 'IMPACT + UNRESOLVED ISSUE'], 'CONCEPTUAL RECORD. NO TESTIMONY');
    K.rbox(1.72, 0.09, 1.24, K.mat.plastic(0x49423b, 0.7), [-1.58, 0.91, 0.38], null, { parent: harmLayer, r: 0.035 });
    horizontalSheet(1.56, 1.08, harmLogMat, [-1.58, 0.968, 0.38], harmLayer, -0.025);
    K.rbox(0.36, 0.035, 0.085, K.mat.metal(0xa9abad, 0.36), [-1.58, 1.008, -0.08], null, { parent: harmLayer, r: 0.012 });
    var timelineMat = paper('ISSUE TIMELINE', '#80523a', ['VERSION BEFORE', 'BARRIER OBSERVED', 'STATUS: UNRESOLVED'], 'DOCUMENT BEFORE DESIGNING');
    K.rbox(1.72, 1.17, 0.07, K.mat.metal(0x505659, 0.56), [-0.34, 1.72, -2.35], null, { parent: harmLayer, r: 0.035 });
    verticalSheet(1.57, 1.0, timelineMat, [-0.34, 1.72, -2.26], harmLayer);

    /* The mock-up is physical and subdued: no spinning core or theatrical crack. */
    var mockup = new THREE.Group(); mockup.name = 'bfs-repair-interface-mockup'; ctx.root.add(mockup); mockup.position.set(0.55, 0, -0.05);
    K.rbox(1.82, 0.1, 1.22, K.mat.metal(0x474e51, 0.48), [0, 0.92, 0], null, { parent: mockup, r: 0.055 });
    K.rbox(1.58, 0.055, 0.98, K.mat.plastic(0xe3ded2, 0.84), [0, 0.992, 0], null, { parent: mockup, r: 0.035 });
    horizontalSheet(1.42, 0.84, paper('CURRENT MOCK-UP', '#56636a', ['CONTROL A', 'CONTROL B', 'UNRESOLVED BARRIER'], 'CONCEPTUAL INTERFACE'), [0, 1.045, 0], mockup);
    K.rbox(0.32, 0.045, 0.08, K.mat.metal(0xa7aaab, 0.4), [0.52, 1.06, -0.37], null, { parent: mockup, r: 0.012 });

    /* State two applies a visible interface patch while owner authority stays put. */
    var patchMat = paper('INTERFACE PATCH', '#476b57', ['CONTROL REPOSITIONED', 'COPY REVISED', 'AUTHORITY UNCHANGED'], 'PATCH THE MOCK-UP. THEN CHECK POWER');
    horizontalSheet(1.42, 0.84, patchMat, [0.55, 1.066, -0.05], patchLayer);
    var unchangedMat = paper('AUTHORITY UNCHANGED', '#8a3028', ['AGENDA: OWNER SHELF', 'APPROVAL: OWNER SHELF', 'MATERIALS: OWNER SHELF'], 'A PATCH IS NOT YET A POWER SHIFT');
    K.rbox(2.38, 1.06, 0.07, K.mat.metal(0x505659, 0.54), [-2.45, 1.9, -2.3], null, { parent: patchLayer, r: 0.035 });
    verticalSheet(2.22, 0.9, unchangedMat, [-2.45, 1.9, -2.21], patchLayer);

    /* State three places the actual agenda, approval stamp, and materials at the shared table. */
    var emptyShelfMat = paper('AUTHORITY MOVED', '#476b57', ['AGENDA → SHARED TABLE', 'APPROVAL → SHARED TABLE', 'MATERIALS → SHARED TABLE'], 'THE SHELF IS NOW EMPTY');
    K.rbox(2.26, 0.74, 0.07, K.mat.metal(0x505659, 0.54), [-2.48, 1.48, -2.29], null, { parent: shiftLayer, r: 0.035 });
    verticalSheet(2.1, 0.59, emptyShelfMat, [-2.48, 1.48, -2.2], shiftLayer);
    var sharedZone = new THREE.Group(); sharedZone.name = 'bfs-repair-shared-authority'; shiftLayer.add(sharedZone); sharedZone.position.set(1.85, 0, 0.68);
    K.rbox(2.2, 0.035, 1.34, K.mat.plastic(0x6d836f, 0.76), [0, 0.955, 0], null, { parent: sharedZone, r: 0.025 });
    K.rbox(2.08, 0.024, 1.22, K.mat.plastic(0xd9dfd3, 0.88), [0, 0.981, 0], null, { parent: sharedZone, r: 0.02 });
    binder(sharedZone, [-0.56, 1.055, -0.28], 0x315a6b, 'SHARED AGENDA');
    approvalStamp(sharedZone, [0.2, 1.02, -0.25]);
    materialsTray(sharedZone, [0.5, 1.02, 0.34]);
    horizontalSheet(0.88, 0.52, paper('APPROVAL HELD HERE', '#476b57', [], 'DECISION AUTHORITY MOVED'), [0.15, 1.18, 0.12], sharedZone);
    var shiftedMat = paper('SHIFT POWER', '#476b57', ['AGENDA SET HERE', 'APPROVAL HELD HERE', 'MATERIALS CONTROLLED HERE'], 'MOVEMENT, NOT REPRESENTATION, IS THE EVIDENCE');
    K.rbox(2.38, 1.06, 0.07, K.mat.metal(0x505659, 0.54), [1.63, 1.9, -2.3], null, { parent: shiftLayer, r: 0.035 });
    verticalSheet(2.22, 0.9, shiftedMat, [1.63, 1.9, -2.21], shiftLayer);
    K.storyCard(1, 'Keep the harm in view', [0.18, 3.28, 0.74], { color: PAL.red, parent: harmFocus });
    K.halo(0.82, PAL.red, [-1.58, 0.08, 0.38], { spin: 0.42, tube: 0.025, parent: harmFocus });
    K.flow([[-1.58, 1.18, 0.38], [-0.8, 1.35, -0.05], [0.22, 1.2, -0.05]], { color: PAL.red, pulseColor: PAL.red, radius: 0.026, pulses: 3, speed: 0.1, parent: harmFocus });
    K.storyCard(2, 'Patch the tool, then check power', [0.35, 3.28, 0.74], { color: PAL.orange, parent: patchFocus });
    K.halo(0.86, PAL.orange, [0.55, 0.08, -0.05], { spin: 0.5, tube: 0.024, parent: patchFocus });
    K.halo(0.75, PAL.red, [-2.48, 0.08, -1.95], { spin: 0.34, tube: 0.018, parent: patchFocus });
    K.storyCard(3, 'Move authority, not only chairs', [0.38, 3.28, 0.74], { color: PAL.green, parent: shiftFocus });
    K.flow([[-2.48, 1.42, -1.85], [-1.2, 1.7, -1.2], [0.35, 1.48, -0.2], [1.75, 1.22, 0.6]], { color: PAL.green, pulseColor: PAL.green, radius: 0.038, pulses: 5, speed: 0.13, parent: shiftFocus });
    K.halo(1.28, PAL.green, [1.85, 0.08, 0.68], { spin: 0.3, tube: 0.028, parent: shiftFocus });

    function setMode(mode) {
      mode = mode === 'path' || mode === 'risk' ? mode : 'observe';
      harmLayer.visible = true;
      patchLayer.visible = mode === 'path';
      shiftLayer.visible = mode === 'risk';
      ownerArtifacts.visible = mode !== 'risk';
      harmFocus.visible = mode === 'observe';
      patchFocus.visible = mode === 'path';
      shiftFocus.visible = mode === 'risk';
    }
    setMode(ctx.view);
    return {
      setMode: setMode,
      cameraFor: function (mode, narrow) {
        if (narrow) {
          if (mode === 'risk') return { cam: [3.95, 2.9, 5.2], look: [0.28, 0.88, 0.08] };
          if (mode === 'path') return { cam: [3.8, 2.8, 5.0], look: [-0.18, 0.9, -0.2] };
          return { cam: [3.8, 2.9, 5.1], look: [-0.35, 0.9, -0.08] };
        }
        if (mode === 'risk') return { cam: [4.8, 3.0, 5.7], look: [0.3, 0.8, 0.03] };
        if (mode === 'path') return { cam: [4.55, 2.85, 5.4], look: [-0.15, 0.84, -0.25] };
        return { cam: [4.55, 2.95, 5.55], look: [-0.35, 0.84, -0.08] };
      }
    };
  };
  ANCHORS.repair = [[-1.58, 0.98, 0.38], [0.55, 1.08, -0.05], [1.85, 1.12, 0.68]];

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
      g.fillStyle = '#8ba0b4'; g.font = 'bold 6px monospace'; g.fillText('WHO ADAPTS?', w * 0.08, h * 0.26);
      g.fillStyle = '#00aeb3'; g.fillRect(w * 0.08, h * 0.4, w * 0.3, h * 0.16);
      g.fillStyle = '#da291c'; g.fillRect(w * 0.08, h * 0.66, w * 0.66, h * 0.16);
      g.fillStyle = '#e8eef4'; g.font = 'bold 5px monospace'; g.fillText('FITS', w * 0.42, h * 0.52); g.fillText('COST', w * 0.78, h * 0.78);
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
    K.flow([[-0.25, 0.58, 1.25], [0.4, 0.48, 1.18], [1.05, 0.58, 1.25]], { color: PAL.amber, pulses: 0, radius: 0.014, opacity: 0.8, arrow: false });
    var qmark = K.add(new K.THREE.PlaneGeometry(0.4, 0.4), K.mat.holo(PAL.amber, 0.55), [0.4, 1.05, 1.6], [0, -0.3, 0], { shadow: false });
    K.float(qmark, 0.05, 1.2);
  };
  ANCHORS.surveillanceflow = [[-2.0, 1.35, 0], [-0.55, 1.25, 0.1], [0.4, 0.95, 1.6]];

  /* W7 activity: toolkit - assemble the five-part system anatomy */
  SCENES.toolkit = function (K, ctx) {
    K.stage({ lip: ctx.pathOn ? PAL.teal : PAL.amber });
    var hot = ctx.riskOn;
    K.rbox(5.8, 0.08, 1.5, K.mat.plastic(PAL.bone, 0.58), [0, 0.18, 0], null, { r: 0.06 });
    var xs = [-2.35, -1.18, 0, 1.18, 2.35];
    var names = ['DATA', 'RULE / MODEL', 'DEPLOYMENT', 'DECISION', 'FEEDBACK'];
    xs.forEach(function (x, i) {
      K.cyl(0.42, 0.46, 0.08, K.mat.plastic(i === 3 && hot ? PAL.redSoft : PAL.floor, 0.52), [x, 0.27, 0]);
      var labelMat = K.screen(48, 14, function (g, w, h) {
        g.fillStyle = '#17253d'; g.fillRect(0, 0, w, h);
        g.fillStyle = i === 3 && hot ? '#ff8d80' : '#e8eef4';
        g.font = 'bold 5.2px monospace'; g.fillText(names[i], w * 0.08, h * 0.68);
      }, { glow: 0.62 });
      K.add(new K.THREE.PlaneGeometry(0.82, 0.24), labelMat, [x, 1.42, 0.18], null, { shadow: false });
    });
    /* 1. records or data */
    for (var f = 0; f < 4; f++) K.rbox(0.56, 0.05, 0.38, K.mat.plastic(f === 3 && hot ? PAL.redSoft : PAL.white, 0.62), [-2.35, 0.38 + f * 0.09, 0], [0, f * 0.08, 0], { r: 0.02 });
    /* 2. rule or model */
    var modelRing = K.torus(0.34, 0.04, K.mat.metal(0xd7dee6, 0.3), [-1.18, 0.78, 0], [Math.PI / 2, 0, 0]);
    K.spin(modelRing, 0.45, 'z');
    K.sph(0.14, K.mat.neon(hot ? PAL.red : PAL.amber, 1.1), [-1.18, 0.78, 0], { shadow: false });
    /* 3. deployment puts the model into an institution */
    K.archGate([0, 0.28, 0], { w: 0.78, h: 1.0, beamColor: hot ? PAL.red : PAL.orange, beamSpeed: 0.8 });
    /* 4. a decision changes access */
    K.rbox(0.45, 0.66, 0.08, K.mat.plastic(PAL.greenSoft, 0.5), [1.18, 0.61, -0.28], null, { r: 0.04 });
    K.rbox(0.45, 0.66, 0.08, K.mat.plastic(PAL.redSoft, 0.5), [1.18, 0.61, 0.28], null, { r: 0.04 });
    K.person({ pos: [1.72, 0.28, 0.18], face: -1.4, scale: 0.72, color: PAL.orange, tone: 0x8a5a3b });
    /* 5. the decision returns as future data */
    var feedbackRing = K.halo(0.34, ctx.pathOn ? PAL.green : PAL.line, [2.35, 0.68, 0], { spin: 0.75 });
    void feedbackRing;
    K.cone(0.09, 0.32, K.mat.neon(PAL.green, 0.9), [2.58, 0.83, 0], [0, 0, -0.85], { shadow: false });
    var forward = xs.map(function (x) { return [x, 0.56, 0]; });
    K.flow(forward, { color: ctx.pathOn ? PAL.teal : PAL.line, pulseColor: hot ? PAL.red : PAL.teal, pulses: 5, speed: 0.11 });
    K.flow([[2.35, 0.95, -0.08], [1.25, 1.2, -0.75], [-0.9, 1.18, -0.8], [-2.35, 0.82, -0.15]], { color: ctx.pathOn ? PAL.green : PAL.line, pulseColor: PAL.green, pulses: ctx.pathOn ? 3 : 1, speed: 0.09, opacity: 0.68 });
    if (hot) {
      K.halo(0.5, PAL.red, [-2.35, 0.28, 0], { spin: 0.42 });
      K.halo(0.46, PAL.red, [0, 0.28, 0], { spin: -0.5 });
    }
  };
  ANCHORS.toolkit = [[-1.75, 1.0, 0], [0.55, 1.0, 0], [2.35, 1.0, 0]];

  /* W8 activity: datastory - apply OCAP and CARE to move governance */
  SCENES.datastory = function (K, ctx) {
    K.stage({ lip: ctx.pathOn ? PAL.green : PAL.amber });
    var hot = ctx.riskOn;
    /* Agency possession: the community can request reports, but the agency holds the raw record. */
    K.rbox(1.25, 1.35, 0.72, K.mat.metal(0x33415c, 0.35), [-2.1, 0.68, -0.2], null, { r: 0.06 });
    for (var d = 0; d < 4; d++) K.rbox(0.92, 0.18, 0.08, K.mat.plastic(d === 2 && hot ? PAL.red : PAL.inkSoft, 0.42), [-2.1, 0.33 + d * 0.28, 0.18], null, { r: 0.025 });
    var agency = K.screen(84, 24, function (g, w, h) {
      g.fillStyle = '#17253d'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#e8eef4'; g.font = 'bold 5.6px monospace'; g.fillText('AGENCY HOLDS RAW DATA', w * 0.07, h * 0.42);
      g.fillStyle = hot ? '#ff8d80' : '#ffcc66'; g.font = '4.8px monospace'; g.fillText('COMMUNITY RECEIVES REPORTS', w * 0.07, h * 0.75);
    }, { glow: 0.72 });
    K.add(new K.THREE.PlaneGeometry(1.18, 0.48), agency, [-2.1, 1.55, 0.18], null, { shadow: false });
    K.torus(0.16, 0.04, K.mat.metal(0xd9b64a, 0.3), [-1.48, 0.82, 0.2], null);
    K.rbox(0.28, 0.3, 0.1, K.mat.metal(0xd9b64a, 0.3), [-1.48, 0.62, 0.2], null, { r: 0.04 });
    /* The frameworks are principles that must change real governance. */
    var principleGroups = [
      { title: 'OCAP', items: ['OWNERSHIP', 'CONTROL', 'ACCESS', 'POSSESSION'], x: -0.45, c: PAL.teal },
      { title: 'CARE', items: ['COLLECTIVE BENEFIT', 'AUTHORITY TO CONTROL', 'RESPONSIBILITY', 'ETHICS'], x: 0.72, c: PAL.amber }
    ];
    principleGroups.forEach(function (group, gi) {
      var head = K.screen(38, 16, function (g, w, h) {
        g.fillStyle = '#17253d'; g.fillRect(0, 0, w, h);
        g.fillStyle = gi ? '#ffcc66' : '#7ef0f2'; g.font = 'bold 7px monospace'; g.fillText(group.title, w * 0.28, h * 0.66);
      }, { glow: 0.7 });
      K.add(new K.THREE.PlaneGeometry(0.8, 0.34), head, [group.x, 1.45, -0.05], null, { shadow: false });
      group.items.forEach(function (name, ii) {
        var py = 0.42 + ii * 0.23;
        K.rbox(0.78, 0.14, 0.42, K.mat.plastic(ctx.pathOn ? group.c : PAL.floor, 0.52), [group.x, py, -0.05], null, { r: 0.035 });
        var token = K.screen(64, 12, function (g, w, h) {
          g.fillStyle = 'rgba(23,37,61,.94)'; g.fillRect(0, 0, w, h);
          g.fillStyle = '#f4f6f8'; g.font = 'bold 4.6px monospace'; g.fillText(name, w * 0.08, h * 0.7);
        }, { glow: ctx.pathOn ? 0.65 : 0.35 });
        K.add(new K.THREE.PlaneGeometry(0.66, 0.18), token, [group.x, py + 0.14, 0.13], null, { shadow: false });
      });
    });
    /* Community governance is shown as decision roles, not as cultural decoration. */
    K.cyl(0.9, 0.96, 0.1, K.mat.plastic(PAL.bone, 0.55), [2.05, 0.48, 0]);
    K.cyl(0.1, 0.14, 0.48, K.mat.metal(), [2.05, 0.24, 0]);
    [[1.55, 0.85, 0x4a2f1d], [2.12, 1.12, 0x8a5a3b], [2.62, 0.78, 0xc9986a]].forEach(function (p, pi) {
      K.person({ pos: [p[0], 0.02, p[1]], face: 3.0 + pi * 0.2, scale: 0.82, color: pi === 1 ? PAL.orange : PAL.teal, tone: p[2] });
    });
    var govern = K.screen(84, 24, function (g, w, h) {
      g.fillStyle = '#17253d'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#79d99a'; g.font = 'bold 5.6px monospace'; g.fillText('COMMUNITY GOVERNANCE', w * 0.07, h * 0.42);
      g.fillStyle = '#e8eef4'; g.font = '4.8px monospace'; g.fillText('AUTHORITY + RESOURCES MOVE', w * 0.07, h * 0.75);
    }, { glow: 0.72 });
    K.add(new K.THREE.PlaneGeometry(1.18, 0.48), govern, [2.05, 1.5, 0], null, { shadow: false });
    var authority = K.sph(0.11, K.mat.neon(ctx.pathOn ? PAL.green : PAL.amber, 1.25), [-1.2, 1.0, 0.32], { shadow: false });
    K.onTick(function (t) {
      var u = ctx.pathOn ? (Math.sin(t * 0.55) + 1) / 2 : 0;
      authority.position.set(-1.2 + u * 3.25, 1.0 + Math.sin(u * Math.PI) * 0.45, 0.32 - u * 0.24);
    });
    K.flow([[-1.2, 0.95, 0.28], [-0.35, 1.2, 0.1], [0.7, 1.12, 0.08], [2.05, 0.72, 0]], { color: ctx.pathOn ? PAL.green : PAL.line, pulseColor: PAL.green, pulses: ctx.pathOn ? 4 : 1, speed: 0.09 });
    if (hot) K.halo(0.52, PAL.red, [-2.1, 0.1, -0.2], { spin: 0.65 });
  };
  ANCHORS.datastory = [[-2.1, 1.45, 0], [0.1, 1.35, 0], [2.05, 1.45, 0]];

  /* W9 activity: promisefunnel - x-ray the helpful promise */
  SCENES.promisefunnel = function (K, ctx) {
    K.stage();
    var hot = ctx.riskOn;
    /* the promise sign */
    var sign = K.add(new K.THREE.PlaneGeometry(1.3, 0.7), K.screen(52, 28, function (g, w, h) {
      g.fillStyle = '#eafefe'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#00aeb3'; g.font = 'bold 9px sans-serif'; g.fillText('SUPPORT', w * 0.18, h * 0.43);
      g.font = '5px sans-serif'; g.fillText('PROMISE', w * 0.34, h * 0.64);
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
    K.rbox(0.95, 0.06, 0.7, K.mat.plastic(0xdfe7ee, 0.5), [-1.65, 0.58, -0.9], [0, 0.18, 0], { r: 0.03 });
    K.add(new K.THREE.PlaneGeometry(0.66, 0.22), patchTag, [-1.65, 1.0, -0.9], [0, 0.18, 0], { shadow: false });
    K.box(0.4, 0.03, 0.12, K.mat.plastic(0xd9d2be, 0.5), [-1.72, 0.63, -0.88], [0, 0.8, 0]);
    K.box(0.4, 0.03, 0.12, K.mat.plastic(0xd9d2be, 0.5), [-1.58, 0.63, -0.94], [0, 0.2, 0]);
    /* repair side: a new seat and the power token */
    K.rbox(0.95, 0.06, 0.7, K.mat.plastic(PAL.greenSoft, 0.5), [1.65, 0.58, -0.9], [0, -0.18, 0], { r: 0.03 });
    K.add(new K.THREE.PlaneGeometry(0.66, 0.22), repairTag, [1.65, 1.0, -0.9], [0, -0.18, 0], { shadow: false });
    K.rbox(0.2, 0.04, 0.2, K.mat.plastic(PAL.teal, 0.4), [1.65, 0.63, -0.9], null, { r: 0.01 });
    K.box(0.2, 0.18, 0.03, K.mat.plastic(PAL.teal, 0.4), [1.65, 0.74, -0.81]);
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
      power2.position.set(Math.cos(0.5) * u * 1.45, 1.15 - u * 0.35, Math.sin(0.5) * u * 1.45);
    });
    if (hot) K.halo(0.5, PAL.red, [0, 0.56, 0], { spin: 0.8 });
  };
  ANCHORS.repairtable = [[0, 1.15, 0], [0, 1.0, -0.9], [1.3, 1.0, 0.7]];

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
    lectern(-2.1, 0, 0, false, 'WEEK 1 ENTRY');
    lectern(-0.45, 0, 0, true, 'LATER ENTRY');
    /* the change marker between them */
    var delta = new K.THREE.Group(); ctx.root.add(delta);
    K.add(new K.THREE.TetrahedronGeometry(0.24, 0), K.mat.neon(hot ? PAL.red : PAL.amber, 1.2), [0, 0, 0], null, { parent: delta });
    delta.position.set(-1.28, 1.55, 0);
    K.spin(delta, 0.8); K.float(delta, 0.06, 1.3);
    K.flow([[-2.1, 1.15, 0], [-1.28, 1.55, 0], [-0.45, 1.15, 0]], { color: hot ? PAL.red : PAL.teal, pulseColor: hot ? PAL.red : PAL.teal, pulses: 3, speed: 0.12 });
    /* the final plan drafting table */
    K.rbox(1.7, 0.08, 1.1, K.mat.plastic(0xcdb08b, 0.55), [1.55, 0.55, 0], null, { r: 0.04 });
    [[0.85, -0.45], [2.25, -0.45], [0.85, 0.45], [2.25, 0.45]].forEach(function (p) { K.cyl(0.045, 0.055, 0.55, K.mat.metal(0x8a7a64, 0.4), [p[0], 0.27, p[1]]); });
    var plan = K.screen(84, 36, function (g, w, h) {
      g.fillStyle = '#fdfbf4'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1b2a4a'; g.font = 'bold 5.4px sans-serif'; g.fillText('FINAL RESPONSE PLAN', w * 0.08, h * 0.16);
      g.strokeStyle = '#00aeb3'; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(w * 0.14, h * 0.66); g.lineTo(w * 0.34, h * 0.4); g.lineTo(w * 0.56, h * 0.56); g.lineTo(w * 0.82, h * 0.3); g.stroke();
      g.fillStyle = '#da291c'; g.beginPath(); g.arc(w * 0.82, h * 0.3, 2.6, 0, 7); g.fill();
      g.fillStyle = '#8ba0b4'; g.fillRect(w * 0.08, h * 0.78, w * 0.6, h * 0.08);
    }, { glow: 0.45 });
    /* Lift the paper above the tabletop so the two planes never z-fight. */
    K.add(new K.THREE.PlaneGeometry(1.15, 0.74), plan, [1.55, 0.64, 0], [-Math.PI / 2, 0, 0], { shadow: false });
    K.person({ pos: [1.8, 0, 1.3], face: 2.95, scale: 0.95, color: PAL.teal, tone: 0x8a5a3b });
    K.flow([[-0.45, 1.15, 0], [0.45, 1.0, 0], [1.45, 0.68, 0]], { color: ctx.pathOn ? PAL.amber : PAL.line, pulseColor: PAL.amber, pulses: 2, speed: 0.1 });
  };
  ANCHORS.capstonemap = [[-1.3, 1.3, 0], [-1.28, 1.7, 0], [1.55, 0.85, 0]];

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

  /* ================================================= REALISTIC ACTIVITIES ===
     These code-native institutional scenes support the optional inspection
     models in Weeks 4 and 7-12. Weeks 2, 3, 6, 13, and 14 intentionally use
     direct evidence activities without a separate three-dimensional model. */
  var REAL_SCENES = {};
  var REAL_SIGNATURES = {};

  function realPlate(K, text, pos, opts) {
    opts = opts || {};
    var mat = K.screen(96, 28, function (g, w, h) {
      g.fillStyle = opts.warn ? '#8d4a43' : '#aa9975'; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(2, 2, w - 4, 2);
      g.strokeStyle = opts.warn ? '#5e2d29' : '#625944'; g.lineWidth = 1.4; g.strokeRect(1, 1, w - 2, h - 2);
      g.fillStyle = opts.warn ? '#f5eee4' : '#24282b'; g.font = '700 9px "Segoe UI", sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(text).toUpperCase(), w / 2, h / 2 + 1);
    }, { glow: 0.12 });
    return K.add(new K.THREE.PlaneGeometry(opts.w || 0.74, opts.h || 0.21), mat, pos, opts.rot || null, { shadow: false, parent: opts.parent });
  }

  /* Week 2: a forensic diagnostic laboratory. The case is read at a proper
     evidence bench, inspected through an optical lens, then compared with four
     different mechanisms represented by distinct working objects. */
  REAL_SCENES.mechanismatch = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn;
    var steel = K.real.surface('darkSteel'), brushed = K.real.surface('steel');
    var oak = K.real.surface('oak'), paper = K.real.surface('paper');

    /* Architectural lab wall, rail, shelving, and warm task illumination. */
    K.rbox(6.6, 2.15, 0.16, K.real.surface('concrete'), [0, 1.05, -2.18], null, { r: 0.025 });
    K.box(6.25, 0.055, 0.2, steel, [0, 1.75, -2.03]);
    K.box(6.25, 0.055, 0.42, oak, [0, 0.47, -1.91]);
    for (var wp = -2; wp <= 2; wp++) K.box(0.05, 1.86, 0.2, brushed, [wp * 1.35, 1.06, -2.03]);
    var taskLight = new K.THREE.PointLight(0xffd7a6, 0.44, 5.2, 2); taskLight.position.set(-0.7, 2.25, 0.45); ctx.root.add(taskLight);

    K.real.table([-0.35, 0, 0.25], { w: 5.85, d: 1.7, h: 0.68, top: oak });

    /* Evidence folder and readable outcome sheet. */
    var caseGroup = new K.THREE.Group(); ctx.root.add(caseGroup); caseGroup.position.set(-2.15, 0.77, 0.18); caseGroup.rotation.y = 0.14;
    K.rbox(1.25, 0.045, 0.86, K.real.surface('leather'), [0, 0, 0], null, { parent: caseGroup, r: 0.025 });
    for (var pg = 0; pg < 4; pg++) K.rbox(1.08, 0.018, 0.72, paper, [0.04 + pg * 0.008, 0.045 + pg * 0.018, -0.02 + pg * 0.01], [0, -0.025 * pg, 0], { parent: caseGroup, r: 0.01 });
    var outcome = K.screen(160, 96, function (g, w, h) {
      g.fillStyle = '#f2ede2'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#312f2c'; g.font = '700 15px "Segoe UI", sans-serif'; g.fillText('CASE OUTCOME', 13, 21);
      g.fillStyle = '#8f2924'; g.font = '800 20px "Segoe UI", sans-serif'; g.fillText('DENIED', 13, 48);
      g.strokeStyle = '#aaa295'; g.lineWidth = 2;
      for (var ln = 0; ln < 3; ln++) { g.beginPath(); g.moveTo(13, 64 + ln * 10); g.lineTo(145 - ln * 15, 64 + ln * 10); g.stroke(); }
    }, { glow: 0.04 });
    K.add(new K.THREE.PlaneGeometry(1.0, 0.6), outcome, [-2.11, 0.87, 0.17], [-Math.PI / 2, 0.14, 0], { shadow: false });
    K.cyl(0.11, 0.13, 0.018, K.real.accent(PAL.red, hot), [-2.64, 0.86, 0.45], [Math.PI / 2, 0, 0], { seg: 40 });
    realPlate(K, 'Case file', [-2.15, 1.34, 0.68], { w: 0.82 });

    /* Optical inspection lens on an articulated laboratory stand. */
    K.cyl(0.12, 0.16, 0.08, steel, [-0.72, 0.75, 0.12], null, { seg: 40 });
    K.cyl(0.035, 0.045, 0.72, brushed, [-0.72, 1.08, 0.12], null, { seg: 24 });
    K.box(0.72, 0.05, 0.07, brushed, [-0.38, 1.4, 0.12], [0, 0, -0.08]);
    var lens = K.real.lens([-0.03, 1.36, 0.15], { r: 0.47, rot: [0.04, -0.18, -0.08], color: hot ? PAL.redSoft : PAL.tealSoft });
    K.onTick(function (t) { lens.rotation.z = -0.08 + Math.sin(t * 0.45) * 0.015; });

    /* Four mechanisms are different machines, not four renamed boxes. */
    var stations = [[0.9, -0.55], [2.05, -0.55], [0.9, 0.62], [2.05, 0.62]];
    stations.forEach(function (p, si) {
      var selected = hot ? si === 2 : (path ? si === 1 : false);
      K.rbox(0.92, 0.065, 0.82, selected ? K.real.accent(hot ? PAL.red : PAL.teal, hot) : K.real.surface('limestone'), [p[0], 0.76, p[1]], null, { r: 0.025 });
      K.box(0.72, 0.025, 0.62, steel, [p[0], 0.805, p[1]], null, { shadow: false });
      if (selected) K.box(0.78, 0.018, 0.018, K.mat.neon(hot ? PAL.red : PAL.teal, 0.35), [p[0], 0.85, p[1] + 0.32], null, { shadow: false });
    });
    var ruleGear = K.real.gear([0.9, 1.2, -0.55], { r: 0.34, mat: brushed });
    K.onTick(function (t) { ruleGear.rotation.z = t * 0.18; });
    realPlate(K, 'Rule', [0.9, 1.7, -0.54], { w: 0.7 });

    var records = new K.THREE.Group(); ctx.root.add(records); records.position.set(2.05, 0.83, -0.55);
    K.rbox(0.58, 0.72, 0.56, brushed, [0, 0.36, 0], null, { parent: records, r: 0.025 });
    for (var dr = 0; dr < 3; dr++) {
      K.rbox(0.47, 0.16, 0.035, steel, [0, 0.18 + dr * 0.21, 0.292], null, { parent: records, r: 0.012 });
      K.box(0.14, 0.025, 0.025, K.real.accent(PAL.amber, false), [0, 0.18 + dr * 0.21, 0.32], null, { parent: records });
    }
    realPlate(K, 'Record', [2.05, 1.7, -0.54], { w: 0.72 });

    K.real.frame([0.9, 0.83, 0.62], { w: 0.62, h: 0.72, d: 0.16, beam: 0.07, light: hot ? PAL.red : PAL.amber });
    K.box(0.42, 0.62, 0.055, K.real.surface('paper'), [0.9, 1.14, 0.58]);
    K.box(0.21, 0.46, 0.06, K.real.surface('darkSteel'), [0.9, 1.06, 0.615]);
    realPlate(K, 'Default', [0.9, 1.7, 0.63], { w: 0.78, warn: hot });

    var overlap = new K.THREE.Group(); ctx.root.add(overlap); overlap.position.set(2.05, 1.18, 0.62);
    K.torus(0.29, 0.035, K.real.accent(PAL.teal, false), [-0.15, 0, 0], null, { parent: overlap });
    K.torus(0.29, 0.035, K.real.accent(PAL.amber, false), [0.15, 0, 0], null, { parent: overlap });
    K.add(new K.THREE.CircleGeometry(0.16, 40), K.mat.glass(PAL.greenSoft, 0.28), [0, 0, -0.01], null, { parent: overlap, shadow: false });
    realPlate(K, 'Overlap', [2.05, 1.7, 0.63], { w: 0.8 });

    var target = hot ? stations[2] : (path ? stations[1] : stations[0]);
    K.flow([[-1.75, 1.0, 0.18], [-0.72, 1.37, 0.14], [0.25, 1.18, target[1] * 0.5], [target[0] - 0.38, 1.02, target[1]]], {
      color: hot ? K.color(PAL.red) : K.color(path ? PAL.teal : PAL.line), pulseColor: hot ? K.color(PAL.red) : K.color(PAL.amber), pulses: 3, speed: 0.09, radius: 0.018
    });
  };

  /* Week 3: an institutional switchyard. A real intake terminal feeds a
     mechanical points lever and two built exits, making the rule that changes
     a person's route physically visible. */
  REAL_SCENES.decisionpath = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn;
    var steel = K.real.surface('darkSteel'), brushed = K.real.surface('steel');
    var concrete = K.real.surface('concrete');

    /* Intake terminal with paper slot, monitor, and service counter. */
    K.rbox(1.22, 1.2, 0.72, steel, [-2.45, 0.62, 0], null, { r: 0.055 });
    K.rbox(0.98, 0.58, 0.055, K.real.surface('rubber'), [-2.45, 0.91, 0.38], [-0.08, 0, 0], { r: 0.035 });
    var inputScreen = K.screen(128, 72, function (g, w, h) {
      g.fillStyle = '#182126'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#b9c9c6'; g.font = '700 13px "Segoe UI", sans-serif'; g.fillText('INTAKE RECORD', 12, 19);
      g.fillStyle = '#6d777a'; for (var i = 0; i < 3; i++) g.fillRect(12, 31 + i * 11, 78 - i * 10, 5);
      g.fillStyle = hot ? '#a64941' : '#a58a57'; g.fillRect(94, 31, 22, 28);
    }, { glow: 0.2 });
    K.add(new K.THREE.PlaneGeometry(0.84, 0.47), inputScreen, [-2.45, 0.93, 0.414], [-0.08, 0, 0], { shadow: false });
    K.box(0.62, 0.045, 0.1, brushed, [-2.45, 0.48, 0.4]);
    K.rbox(0.55, 0.035, 0.28, K.real.surface('paper'), [-2.45, 0.43, 0.52], [-0.14, 0, 0], { r: 0.01 });
    realPlate(K, 'Input', [-2.45, 1.48, 0.2], { w: 0.7 });

    /* Embedded rails and sleepers give the route credible physical weight. */
    var neutralRail = 0x555e62, supportRail = 0x496957, harmRail = 0x8f2924;
    function rail(points, color, radius) { K.flow(points, { color: color, pulseColor: color, pulses: 0, radius: radius || 0.035, opacity: 0.94, arrow: false }); }
    var inA = [[-1.82, 0.08, -0.09], [-1.05, 0.09, -0.09], [-0.32, 0.1, -0.09]];
    var inB = [[-1.82, 0.08, 0.09], [-1.05, 0.09, 0.09], [-0.32, 0.1, 0.09]];
    rail(inA, neutralRail); rail(inB, neutralRail);
    var goodA = [[-0.25, 0.1, -0.1], [0.75, 0.1, -0.58], [1.78, 0.1, -1.12]];
    var goodB = [[-0.18, 0.1, 0.08], [0.82, 0.1, -0.4], [1.86, 0.1, -0.94]];
    var badA = [[-0.18, 0.1, -0.08], [0.82, 0.1, 0.42], [1.86, 0.1, 0.96]];
    var badB = [[-0.25, 0.1, 0.1], [0.75, 0.1, 0.6], [1.78, 0.1, 1.14]];
    rail(goodA, path ? supportRail : neutralRail); rail(goodB, path ? supportRail : neutralRail);
    rail(badA, hot ? harmRail : neutralRail); rail(badB, hot ? harmRail : neutralRail);
    for (var sl = -5; sl <= 8; sl++) {
      var sx = -1.7 + sl * 0.27;
      var spread = Math.max(0, sx + 0.3) * 0.34;
      K.box(0.045, 0.035, 0.64 + spread, K.real.surface('oak'), [sx, 0.045, 0], [0, 0, 0], { shadow: false });
    }

    /* Mechanical points cabinet, exposed gear, pivot, and weighted lever. */
    K.rbox(1.05, 0.22, 0.86, concrete, [-0.18, 0.22, 0], null, { r: 0.045 });
    K.rbox(0.86, 0.52, 0.66, steel, [-0.18, 0.52, 0], null, { r: 0.05 });
    var gear = K.real.gear([-0.18, 0.9, 0.34], { r: 0.35, mat: brushed, rot: [0, 0, 0] });
    K.onTick(function (t) { gear.rotation.z = (hot ? -0.28 : path ? 0.28 : 0) + Math.sin(t * 0.35) * 0.012; });
    K.cyl(0.12, 0.14, 0.24, brushed, [0.12, 0.9, -0.08], [Math.PI / 2, 0, 0], { seg: 36 });
    var lever = new K.THREE.Group(); ctx.root.add(lever); lever.position.set(0.12, 0.93, -0.08);
    K.cyl(0.035, 0.045, 0.9, brushed, [0, 0.4, 0], [0, 0, hot ? -0.48 : path ? 0.48 : 0], { parent: lever, seg: 24 });
    K.sph(0.1, K.real.accent(hot ? PAL.red : PAL.amber, hot), [hot ? 0.19 : path ? -0.19 : 0, 0.8, 0], { parent: lever });
    realPlate(K, 'System decision', [-0.18, 1.56, 0.2], { w: 1.15, warn: hot });

    /* Two institutional exits: built architecture, not coloured destination pads. */
    K.real.frame([2.38, 0.04, -1.18], { w: 0.92, h: 1.48, d: 0.22, beam: 0.1, light: path ? PAL.green : PAL.line, face: 0.18 });
    K.box(0.7, 1.22, 0.045, K.mat.glass(PAL.greenSoft, 0.24), [2.38, 0.68, -1.05], [0, 0.18, 0]);
    K.rbox(0.22, 1.66, 0.36, concrete, [1.82, 0.83, -1.28], [0, 0.18, 0], { r: 0.025 });
    realPlate(K, 'Support opens', [2.38, 1.94, -0.92], { w: 1.0 });

    K.real.frame([2.38, 0.04, 1.18], { w: 0.92, h: 1.48, d: 0.22, beam: 0.1, light: hot ? PAL.red : PAL.line, face: -0.18 });
    K.box(0.7, 1.22, 0.045, K.mat.glass(PAL.redSoft, hot ? 0.42 : 0.22), [2.38, 0.68, 1.05], [0, -0.18, 0]);
    K.rbox(0.22, 1.66, 0.36, concrete, [2.94, 0.83, 1.28], [0, -0.18, 0], { r: 0.025 });
    K.box(0.82, 0.06, 0.09, hot ? K.real.accent(PAL.red, true) : brushed, [2.38, 0.98, 0.99]);
    realPlate(K, 'Burden increases', [2.38, 1.94, 0.92], { w: 1.18, warn: true });

    K.flow([[-1.82, 0.42, 0], [-0.75, 0.7, 0], [-0.18, 0.82, 0]], { color: K.color(PAL.line), pulseColor: K.color(PAL.amber), pulses: 2, speed: 0.085, radius: 0.014 });
    var chosenPoints = hot ? [[0.18, 0.72, 0.08], [0.9, 0.55, 0.55], [2.05, 0.48, 1.04]] : [[0.18, 0.72, -0.08], [0.9, 0.55, -0.55], [2.05, 0.48, -1.04]];
    K.flow(chosenPoints, { color: K.color(hot ? PAL.red : path ? PAL.green : PAL.line), pulseColor: K.color(hot ? PAL.red : path ? PAL.green : PAL.amber), pulses: 3, speed: 0.1, radius: 0.018 });
    /* A wheeled document carrier is the case moving through the institution.
       It preserves human consequence without turning a person into a game piece. */
    var carrier = new K.THREE.Group(); ctx.root.add(carrier); carrier.position.set(-1.45, 0.12, 0);
    K.rbox(0.42, 0.16, 0.34, K.real.surface('leather'), [0, 0.16, 0], null, { parent: carrier, r: 0.025 });
    K.rbox(0.34, 0.025, 0.25, K.real.surface('paper'), [0, 0.26, 0], null, { parent: carrier, r: 0.008 });
    K.cyl(0.055, 0.055, 0.055, K.real.surface('darkSteel'), [-0.15, 0.04, -0.12], [Math.PI / 2, 0, 0], { parent: carrier, seg: 24 });
    K.cyl(0.055, 0.055, 0.055, K.real.surface('darkSteel'), [0.15, 0.04, -0.12], [Math.PI / 2, 0, 0], { parent: carrier, seg: 24 });
  };

  /* Week 4: a realistic institutional control room. Four standing presets
     feed a repeated output monitor and a physical burden queue. The scene
     avoids decorative people and makes the institutional mechanism primary. */
  REAL_SCENES.defaultboard = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn;
    var steel = K.real.surface('darkSteel'), brushed = K.real.surface('steel');
    var paper = K.real.surface('paper'), concrete = K.real.surface('concrete');
    K.rbox(6.7, 2.1, 0.18, concrete, [0, 1.02, -2.16], null, { r: 0.028 });
    K.box(6.2, 0.06, 0.22, steel, [0, 1.78, -2.02]);
    K.real.table([-0.25, 0, 0.18], { w: 6.05, d: 1.72, h: 0.7, top: K.real.surface('oak') });
    var taskLight = new K.THREE.PointLight(0xffd9ad, 0.42, 5.4, 2); taskLight.position.set(-0.3, 2.35, 0.55); ctx.root.add(taskLight);

    var consoleGroup = new K.THREE.Group(); ctx.root.add(consoleGroup); consoleGroup.position.set(-1.15, 0.78, -0.12); consoleGroup.rotation.x = -0.08;
    K.rbox(3.1, 0.86, 0.46, steel, [0, 0.35, 0], null, { parent: consoleGroup, r: 0.055 });
    var consoleLabels = ['MAP NAME', 'CREDIT PROXY', 'PATROL DATA', 'NAME FIELD'];
    consoleLabels.forEach(function (label, i) {
      var x = -1.14 + i * 0.76;
      var face = K.screen(76, 34, function (g, w, h) {
        g.fillStyle = '#172126'; g.fillRect(0, 0, w, h);
        g.fillStyle = '#c8d0cd'; g.font = '700 7px "Segoe UI", sans-serif'; g.fillText(label, 7, 11);
        g.fillStyle = hot ? '#a83b34' : path ? '#3c7357' : '#a57c43'; g.fillRect(7, 18, 62, 8);
        g.fillStyle = '#e7e2d8'; g.font = '600 5px "Segoe UI", sans-serif'; g.fillText(hot ? 'PRESET RUNNING' : path ? 'CHALLENGED' : 'STANDING RULE', 7, 31);
      }, { glow: 0.22 });
      K.add(new K.THREE.PlaneGeometry(0.62, 0.28), face, [x, 0.53, 0.244], [-0.08, 0, 0], { parent: consoleGroup, shadow: false });
      K.cyl(0.055, 0.065, 0.19, brushed, [x, 0.15, 0.26], [Math.PI / 2, 0, hot ? -0.42 : path ? 0.42 : 0], { parent: consoleGroup, seg: 28 });
      K.sph(0.072, K.real.accent(hot ? PAL.red : path ? PAL.green : PAL.amber, hot), [x + (hot ? 0.07 : path ? -0.07 : 0), 0.22, 0.3], { parent: consoleGroup, shadow: false });
    });
    realPlate(K, 'Standing presets', [-1.15, 1.78, 0.35], { w: 1.35 });

    var monitorStand = new K.THREE.Group(); ctx.root.add(monitorStand); monitorStand.position.set(1.15, 0.74, -0.38); monitorStand.rotation.y = -0.14;
    K.cyl(0.08, 0.1, 0.56, brushed, [0, 0.28, 0], null, { parent: monitorStand, seg: 30 });
    K.rbox(1.46, 0.94, 0.11, steel, [0, 0.92, 0], null, { parent: monitorStand, r: 0.055 });
    var output = K.screen(144, 88, function (g, w, h) {
      g.fillStyle = '#111a1e'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#aeb9b8'; g.font = '700 12px "Segoe UI", sans-serif'; g.fillText('REPEATED OUTPUT', 12, 18);
      g.fillStyle = hot ? '#a93d35' : path ? '#3f7659' : '#9b7845'; g.fillRect(12, 29, 120, 17);
      g.fillStyle = '#e8e4dc'; g.font = '700 9px "Segoe UI", sans-serif'; g.fillText(hot ? 'BURDEN ASSIGNED' : path ? 'DEFAULT CHANGED' : 'RULE STILL ACTIVE', 18, 41);
      g.strokeStyle = '#667276'; g.lineWidth = 2;
      for (var l = 0; l < 3; l++) { g.beginPath(); g.moveTo(13, 59 + l * 9); g.lineTo(128 - l * 12, 59 + l * 9); g.stroke(); }
    }, { glow: 0.28 });
    K.add(new K.THREE.PlaneGeometry(1.24, 0.76), output, [0, 0.92, 0.061], null, { parent: monitorStand, shadow: false });
    realPlate(K, 'Repeated output', [1.15, 1.93, -0.2], { w: 1.28, warn: hot });

    var queue = new K.THREE.Group(); ctx.root.add(queue); queue.position.set(2.35, 0.78, 0.62); queue.rotation.y = -0.18;
    K.rbox(1.06, 0.12, 0.78, brushed, [0, 0, 0], null, { parent: queue, r: 0.03 });
    K.rbox(0.08, 0.38, 0.8, steel, [-0.49, 0.18, 0], null, { parent: queue, r: 0.02 });
    K.rbox(0.08, 0.38, 0.8, steel, [0.49, 0.18, 0], null, { parent: queue, r: 0.02 });
    var files = hot ? 5 : path ? 1 : 3;
    for (var q = 0; q < files; q++) {
      K.rbox(0.78, 0.025, 0.54, paper, [0, 0.08 + q * 0.055, -0.03 + q * 0.018], [0, q * 0.035, 0], { parent: queue, r: 0.008 });
      K.box(0.18, 0.008, 0.028, K.real.accent(hot ? PAL.red : PAL.amber, hot), [-0.22, 0.1 + q * 0.055, 0.25], null, { parent: queue, shadow: false });
    }
    realPlate(K, 'Burden queue', [2.35, 1.54, 0.78], { w: 1.06, warn: hot });
    K.flow([[0.38, 1.18, 0], [0.7, 1.3, -0.2], [1.05, 1.38, -0.32]], { color: hot ? PAL.red : path ? PAL.green : PAL.line, pulseColor: hot ? PAL.red : PAL.amber, pulses: 2, speed: 0.08, radius: 0.015 });
    K.flow([[1.72, 1.1, -0.2], [2.0, 0.96, 0.2], [2.28, 0.9, 0.56]], { color: hot ? PAL.red : path ? PAL.green : PAL.line, pulseColor: hot ? PAL.red : PAL.amber, pulses: 2, speed: 0.09, radius: 0.015 });
  };
  REAL_SIGNATURES.defaultboard = 'bfs218-w04-default-control-room-real-v2';

  /* Week 7: a realistic analysis bench. Five materially different devices
     represent the five system roles, connected by a visible signal path and
     an honest open connector when feedback evidence is not established. */
  REAL_SCENES.toolkit = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn;
    var steel = K.real.surface('darkSteel'), brushed = K.real.surface('steel');
    var paper = K.real.surface('paper'), oak = K.real.surface('oak');
    K.rbox(6.75, 2.0, 0.16, K.real.surface('concrete'), [0, 0.98, -2.2], null, { r: 0.026 });
    K.real.table([0, 0, 0.22], { w: 6.45, d: 1.72, h: 0.66, top: oak });
    var xs = [-2.45, -1.22, 0, 1.22, 2.45];
    var plates = ['1  DATA', '2  RULE / MODEL', '3  DEPLOYMENT', '4  DECISION', '5  FEEDBACK'];
    plates.forEach(function (label, i) { realPlate(K, label, [xs[i], 1.68, -0.62], { w: i === 1 ? 1.18 : 1.0, warn: hot && i === 3 }); });

    /* Data: a document scanner with a small, readable stack. */
    K.rbox(0.94, 0.18, 0.76, steel, [xs[0], 0.78, 0.08], null, { r: 0.04 });
    K.rbox(0.74, 0.055, 0.54, brushed, [xs[0], 0.9, 0.08], null, { r: 0.018 });
    for (var p = 0; p < 4; p++) K.rbox(0.56, 0.018, 0.42, paper, [xs[0] - 0.06 + p * 0.015, 0.95 + p * 0.025, 0.04 + p * 0.012], [0, p * 0.025, 0], { r: 0.007 });
    K.box(0.62, 0.018, 0.025, K.mat.neon(hot ? PAL.red : PAL.amber, 0.35), [xs[0], 0.94, 0.36], null, { shadow: false });

    /* Rule: a proper processing rack with status lights and cooling slots. */
    K.rbox(0.92, 1.02, 0.7, steel, [xs[1], 1.12, 0], null, { r: 0.045 });
    for (var rack = 0; rack < 5; rack++) {
      K.rbox(0.7, 0.12, 0.045, brushed, [xs[1], 0.78 + rack * 0.17, 0.365], null, { r: 0.012 });
      K.sph(0.025, K.real.accent(rack === 3 && hot ? PAL.red : PAL.teal, rack === 3 && hot), [xs[1] + 0.26, 0.78 + rack * 0.17, 0.4], { shadow: false });
    }

    /* Deployment: an institutional terminal with keyboard and display. */
    K.cyl(0.07, 0.09, 0.42, brushed, [xs[2], 0.88, 0], null, { seg: 28 });
    K.rbox(1.02, 0.66, 0.09, steel, [xs[2], 1.28, -0.02], null, { r: 0.045 });
    var deployScreen = K.screen(120, 72, function (g, w, h) {
      g.fillStyle = '#142026'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#bac6c4'; g.font = '700 10px "Segoe UI", sans-serif'; g.fillText('INSTITUTIONAL USE', 10, 16);
      g.fillStyle = hot ? '#a43a34' : '#4f7773'; g.fillRect(10, 27, 100, 13);
      g.strokeStyle = '#697679'; g.lineWidth = 2; g.beginPath(); g.moveTo(10, 52); g.lineTo(100, 52); g.stroke();
    }, { glow: 0.22 });
    K.add(new K.THREE.PlaneGeometry(0.86, 0.5), deployScreen, [xs[2], 1.28, 0.031], null, { shadow: false });
    K.rbox(0.72, 0.04, 0.28, brushed, [xs[2], 0.72, 0.28], [-0.08, 0, 0], { r: 0.018 });

    /* Decision: two physical output trays show changed access. */
    K.rbox(0.98, 0.1, 0.82, brushed, [xs[3], 0.76, 0], null, { r: 0.03 });
    K.rbox(0.4, 0.34, 0.6, K.real.accent(PAL.green, false), [xs[3] - 0.25, 0.98, 0], null, { r: 0.035 });
    K.rbox(0.4, 0.34, 0.6, K.real.accent(PAL.red, hot), [xs[3] + 0.25, 0.98, 0], null, { r: 0.035 });
    K.rbox(0.3, 0.018, 0.42, paper, [xs[3] + (hot ? 0.25 : -0.25), 1.17, 0], null, { r: 0.006 });

    /* Feedback: a return recorder and an open evidence connector. */
    K.rbox(0.98, 0.72, 0.72, steel, [xs[4], 1.03, 0], null, { r: 0.045 });
    K.cyl(0.25, 0.25, 0.12, brushed, [xs[4], 1.18, 0.38], [Math.PI / 2, 0, 0], { seg: 48 });
    K.torus(0.15, 0.025, K.real.accent(path ? PAL.green : PAL.amber, false), [xs[4], 1.18, 0.46], null, { shadow: false });
    K.rbox(0.56, 0.12, 0.035, paper, [xs[4], 0.86, 0.37], null, { r: 0.008 });
    var lineColor = hot ? PAL.red : path ? PAL.green : PAL.teal;
    K.flow([[xs[0] + 0.45, 1.0, 0], [xs[1] - 0.48, 1.0, 0], [xs[1] + 0.48, 1.0, 0], [xs[2] - 0.5, 1.0, 0], [xs[2] + 0.5, 1.0, 0], [xs[3] - 0.5, 1.0, 0], [xs[3] + 0.5, 1.0, 0], [xs[4] - 0.5, 1.0, 0]], { color: lineColor, pulseColor: hot ? PAL.red : PAL.amber, pulses: 5, speed: 0.085, radius: 0.014 });
    if (path) {
      K.flow([[xs[4], 1.44, -0.18], [1.45, 1.72, -0.8], [-0.8, 1.72, -0.8], [xs[0], 1.24, -0.22]], { color: PAL.green, pulseColor: PAL.green, pulses: 3, speed: 0.07, radius: 0.014 });
    } else {
      K.cyl(0.07, 0.07, 0.1, K.real.accent(PAL.amber, false), [2.02, 1.52, -0.58], [Math.PI / 2, 0, 0], { seg: 28 });
      K.cyl(0.07, 0.07, 0.1, K.real.accent(PAL.amber, false), [-1.92, 1.52, -0.58], [Math.PI / 2, 0, 0], { seg: 28 });
      realPlate(K, 'Feedback evidence?', [0.05, 1.94, -0.72], { w: 1.34, warn: hot });
    }
  };
  REAL_SIGNATURES.toolkit = 'bfs218-w07-system-anatomy-bench-real-v2';

  /* Week 8: a survey-governance table based on the documented First Nations
     Regional Health Survey. Records, decision keys, access register, and the
     storage cabinet make the four OCAP responsibilities materially distinct. */
  REAL_SCENES.datastory = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn;
    var steel = K.real.surface('darkSteel'), paper = K.real.surface('paper'), oak = K.real.surface('oak');
    K.rbox(6.7, 2.05, 0.16, K.real.surface('concrete'), [0, 1.0, -2.18], null, { r: 0.025 });
    K.real.table([0, 0, 0.18], { w: 6.2, d: 1.72, h: 0.68, top: oak });
    var light = new K.THREE.PointLight(0xffd9aa, 0.4, 5.2, 2); light.position.set(0, 2.35, 0.45); ctx.root.add(light);
    var survey = new K.THREE.Group(); ctx.root.add(survey); survey.position.set(-2.15, 0.78, 0.02); survey.rotation.y = 0.12;
    K.rbox(1.18, 0.09, 0.82, K.real.surface('leather'), [0, 0, 0], null, { parent: survey, r: 0.035 });
    for (var p = 0; p < 5; p++) K.rbox(0.98, 0.018, 0.67, paper, [0.04 + p * 0.008, 0.06 + p * 0.025, 0], [0, p * 0.02, 0], { parent: survey, r: 0.008 });
    var cover = K.screen(132, 82, function (g, w, h) { g.fillStyle = '#efe9dc'; g.fillRect(0, 0, w, h); g.fillStyle = '#27302d'; g.font = '800 13px "Segoe UI", sans-serif'; g.fillText('REGIONAL HEALTH', 10, 20); g.fillText('SURVEY', 10, 37); g.fillStyle = '#8e2f29'; g.fillRect(10, 51, 112, 7); g.fillStyle = '#686e68'; g.font = '600 8px "Segoe UI", sans-serif'; g.fillText('GOVERNANCE RECORD', 10, 72); }, { glow: 0.04 });
    K.add(new K.THREE.PlaneGeometry(0.94, 0.58), cover, [-2.11, 0.91, 0.04], [-Math.PI / 2, 0.12, 0], { shadow: false });
    realPlate(K, 'RHS records', [-2.15, 1.55, 0.34], { w: 0.96 });
    var roles = [{ x: -0.7, label: 'Ownership', form: 'seal' }, { x: 0.35, label: 'Control', form: 'key' }, { x: 1.4, label: 'Access', form: 'register' }, { x: 2.45, label: 'Possession', form: 'cabinet' }];
    roles.forEach(function (r, i) {
      K.rbox(0.88, 0.07, 0.72, K.real.surface('limestone'), [r.x, 0.76, 0], null, { r: 0.025 });
      if (r.form === 'seal') { K.cyl(0.23, 0.23, 0.055, K.real.accent(path ? PAL.green : PAL.amber, false), [r.x, 0.88, 0], null, { seg: 48 }); K.torus(0.15, 0.025, steel, [r.x, 0.92, 0], [Math.PI / 2, 0, 0]); }
      if (r.form === 'key') { K.torus(0.16, 0.035, K.real.accent(path ? PAL.green : PAL.amber, false), [r.x - 0.12, 1.0, 0], [Math.PI / 2, 0, 0]); K.box(0.42, 0.055, 0.055, steel, [r.x + 0.13, 1.0, 0]); K.box(0.08, 0.14, 0.055, steel, [r.x + 0.33, 0.96, 0]); }
      if (r.form === 'register') { K.rbox(0.58, 0.055, 0.45, paper, [r.x, 0.91, 0], [0, -0.12, 0], { r: 0.012 }); for (var l = 0; l < 3; l++) K.box(0.38, 0.008, 0.018, steel, [r.x, 0.95, -0.12 + l * 0.1], null, { shadow: false }); }
      if (r.form === 'cabinet') { K.rbox(0.62, 0.76, 0.55, steel, [r.x, 1.1, -0.02], null, { r: 0.025 }); for (var d = 0; d < 3; d++) K.rbox(0.48, 0.14, 0.03, K.real.surface('steel'), [r.x, 0.86 + d * 0.21, 0.27], null, { r: 0.01 }); }
      realPlate(K, r.label, [r.x, 1.62, 0.25], { w: 0.86, warn: hot && i === 3 });
    });
    K.flow([[-1.58, 1.02, 0], [-1.12, 1.18, 0], [-0.7, 1.12, 0], [0.35, 1.12, 0], [1.4, 1.12, 0], [2.45, 1.18, 0]], { color: hot ? PAL.red : path ? PAL.green : PAL.teal, pulseColor: hot ? PAL.red : PAL.amber, pulses: 5, speed: 0.075, radius: 0.015 });
  };
  REAL_SIGNATURES.datastory = 'bfs218-w08-rhs-governance-table-real-v1';

  /* Week 9: a case-analysis X-ray bench. Three distinct documented case files
     preserve the benefit while a transparent inspection screen reveals the
     additional surveillance, sorting, or institutional control. */
  REAL_SCENES.promisefunnel = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn, steel = K.real.surface('darkSteel'), paper = K.real.surface('paper');
    K.rbox(6.7, 2.0, 0.16, K.real.surface('concrete'), [0, 0.98, -2.18], null, { r: 0.026 });
    K.real.table([0, 0, 0.2], { w: 6.25, d: 1.72, h: 0.68, top: K.real.surface('oak') });
    var names = ['MONITORING', 'HIRING', 'HEALTH CARE'];
    for (var i = 0; i < 3; i++) {
      var x = -2.15 + i * 1.18;
      K.rbox(0.96, 0.07, 0.68, K.real.surface(i === 1 ? 'leather' : 'limestone'), [x, 0.78, 0.18], [0, 0.05 * (i - 1), 0], { r: 0.025 });
      for (var p = 0; p < 3; p++) K.rbox(0.76, 0.015, 0.54, paper, [x + p * 0.008, 0.84 + p * 0.022, 0.18], null, { r: 0.006 });
      realPlate(K, names[i], [x, 1.42, 0.36], { w: 0.92, warn: hot && i === 1 });
    }
    var scanner = new K.THREE.Group(); ctx.root.add(scanner); scanner.position.set(1.55, 0.78, -0.05); scanner.rotation.y = -0.12;
    K.rbox(2.18, 1.2, 0.18, steel, [0, 0.62, 0], null, { parent: scanner, r: 0.055 });
    var xray = K.screen(240, 132, function (g, w, h) {
      g.fillStyle = '#121d22'; g.fillRect(0, 0, w, h); g.fillStyle = '#bfc9c7'; g.font = '700 13px "Segoe UI", sans-serif'; g.fillText(path ? 'MECHANISM X-RAY' : hot ? 'POWER + BURDEN TEST' : 'PROMISED BENEFIT', 14, 20);
      var rows = path ? ['SURVEILLANCE MOVES HOME', 'HISTORY BECOMES RANKING', 'CONDITIONS REMAIN'] : hot ? ['WHO CAN REFUSE?', 'WHO HOLDS THE DATA?', 'WHAT STRUCTURE CHANGES?'] : ['RELEASE', 'CONSISTENCY', 'COORDINATED CARE'];
      rows.forEach(function (t, r) { g.fillStyle = hot ? '#a9433b' : path ? '#557d78' : '#a8844f'; g.fillRect(14, 34 + r * 29, 9, 16); g.fillStyle = '#e5e7e4'; g.font = '700 10px "Segoe UI", sans-serif'; g.fillText(t, 31, 46 + r * 29); });
    }, { glow: 0.24 });
    K.add(new K.THREE.PlaneGeometry(1.88, 1.03), xray, [0, 0.64, 0.101], null, { parent: scanner, shadow: false });
    K.cyl(0.07, 0.09, 0.6, steel, [0, -0.3, 0], null, { parent: scanner, seg: 28 });
    realPlate(K, path ? 'Inspect mechanism' : hot ? 'Test power' : 'Keep benefit visible', [1.55, 1.98, 0.16], { w: 1.48, warn: hot });
    K.flow([[-1.58, 1.02, 0.18], [-0.45, 1.22, 0.1], [0.48, 1.3, 0.02]], { color: hot ? PAL.red : path ? PAL.teal : PAL.amber, pulseColor: hot ? PAL.red : PAL.amber, pulses: 3, speed: 0.08, radius: 0.016 });
  };
  REAL_SIGNATURES.promisefunnel = 'bfs218-w09-benevolence-case-xray-real-v1';

  /* Week 10: The Mechanical Policy Sieve & Equity Balance
     A precision analytical apparatus demonstrating feature compression,
     institutional cutoff gatekeeping, and human recourse balance. */
  REAL_SCENES.thresholdaudit = function (K, ctx) {
    if (REAL_ASSETS[ctx.kind] && (ctx.context === 'activity' || ctx.root.userData.renderAsset)) {
      return renderedActivityEnvironment(K, ctx);
    }
    K.stage({ style: 'realist' });
    var THREE = K.THREE;
    var view = ctx.view || 'try';
    var hot = ctx.riskOn;
    var path = ctx.pathOn;
    var policy = typeof ctx.thresholdPolicy === 'number' ? ctx.thresholdPolicy : (hot ? 2 : (path ? 0 : (view === 'try' ? 1 : 0)));

    var steel = K.real.surface('steel');
    var darkSteel = K.real.surface('darkSteel');
    var oak = K.real.surface('oak');
    var paper = K.real.surface('paper');
    var brass = K.mat.metal(0xd4af37, 0.28);
    var antiqueBrass = K.mat.metal(0xb89535, 0.35);
    var acrylic = K.mat.glass(0x8ae0db, 0.32);
    var polishedBronze = K.mat.metal(0xa66b38, 0.32);

    // 1. Studio Architectural Room & Heavy Walnut Plinth Base
    K.rbox(7.6, 0.16, 5.4, K.real.surface('concrete'), [0, -0.16, 0.1], null, { r: 0.04 });
    K.rbox(7.8, 2.8, 0.14, K.real.surface('concrete'), [0, 1.34, -2.42], null, { r: 0.035 });
    for (var sl = -7; sl <= 7; sl++) {
      K.box(0.048, 2.75, 0.05, oak, [sl * 0.52, 1.34, -2.34], null, { shadow: false });
    }
    K.box(7.8, 0.12, 0.08, darkSteel, [0, 0.04, -2.32], null, { shadow: false });

    // Machine Walnut Plinth with bevelled base
    K.rbox(6.3, 0.14, 2.0, oak, [0, -0.01, 0.1], null, { r: 0.03 });
    K.rbox(6.1, 0.06, 1.8, darkSteel, [0, 0.09, 0.1], null, { r: 0.02 });

    // Localized Studio Lighting
    var ambientFill = new THREE.PointLight(0xffeedd, 0.65, 6.5, 2);
    ambientFill.position.set(0, 2.6, 0.8);
    ctx.root.add(ambientFill);

    var hopperGlow = new THREE.PointLight(0x5eead4, 0.55, 3.2, 2);
    hopperGlow.position.set(-2.15, 1.35, 0.45);
    ctx.root.add(hopperGlow);

    var gateGlow = new THREE.PointLight(policy === 2 ? 0xff4d4d : (policy === 0 ? 0x2dd4bf : 0xf59e0b), 0.75, 3.5, 2);
    gateGlow.position.set(-0.15, 1.25, 0.55);
    ctx.root.add(gateGlow);

    var balanceSpot = new THREE.PointLight(0xffdf99, 0.8, 3.2, 2);
    balanceSpot.position.set(2.25, 1.75, 0.45);
    ctx.root.add(balanceSpot);

    // =========================================================================
    // STATION 1 (LEFT: x = -2.15): Feature Compression Hopper & Roller Assembly
    // =========================================================================
    var hopperGroup = new THREE.Group();
    ctx.root.add(hopperGroup);
    hopperGroup.position.set(-2.15, 0.12, 0.1);

    // Acrylic tower columns & glass panels
    K.box(0.04, 1.85, 0.04, darkSteel, [-0.48, 1.05, -0.32], null, { parent: hopperGroup });
    K.box(0.04, 1.85, 0.04, darkSteel, [0.48, 1.05, -0.32], null, { parent: hopperGroup });
    K.box(0.04, 1.85, 0.04, darkSteel, [-0.48, 1.05, 0.32], null, { parent: hopperGroup });
    K.box(0.04, 1.85, 0.04, darkSteel, [0.48, 1.05, 0.32], null, { parent: hopperGroup });

    // Transparent acrylic hopper walls
    K.box(0.92, 1.78, 0.02, acrylic, [0, 1.05, -0.32], null, { parent: hopperGroup, shadow: false });
    K.box(0.92, 1.78, 0.02, acrylic, [0, 1.05, 0.32], null, { parent: hopperGroup, shadow: false });
    K.box(0.02, 1.78, 0.62, acrylic, [-0.48, 1.05, 0], null, { parent: hopperGroup, shadow: false });
    K.box(0.02, 1.78, 0.62, acrylic, [0.48, 1.05, 0], null, { parent: hopperGroup, shadow: false });

    // 3 Luminous Holographic Student Dossier Cards inside hopper
    var cardStudents = [
      { name: 'MAYA', gpa: '2.5 GPA', work: '28h Shift Work', transit: '2 Bus Transfers', care: 'Sole Caregiver', risk: '0.58' },
      { name: 'TARIQ', gpa: '2.6 GPA', work: 'Delayed Aid Hold', transit: 'Long Commute', care: 'Prereq Gaps', risk: '0.61' },
      { name: 'LUCAS', gpa: '2.4 GPA', work: 'Campus Resident', transit: 'Family Support', care: 'No Outside Work', risk: '0.52' }
    ];

    for (var c = 0; c < 3; c++) {
      (function (idx) {
        var cardData = cardStudents[idx];
        var cardTex = K.screen(180, 130, function (g, w, h) {
          g.fillStyle = 'rgba(8, 22, 28, 0.95)'; g.fillRect(0, 0, w, h);
          g.strokeStyle = '#2dd4bf'; g.lineWidth = 3; g.strokeRect(4, 4, w - 8, h - 8);
          g.fillStyle = '#115e59'; g.fillRect(6, 6, w - 12, 26);
          g.fillStyle = '#f0fdfa'; g.font = '800 11px "Segoe UI", sans-serif';
          g.fillText('STUDENT DOSSIER · ' + cardData.name, 14, 23);
          g.fillStyle = '#5eead4'; g.font = '700 8px "Segoe UI", sans-serif';
          g.fillText('LIVED REALITY VS. PROXY', 14, 44);
          g.fillStyle = '#ccfbf1'; g.font = '600 8px "Segoe UI", sans-serif';
          g.fillText('• ' + cardData.work, 14, 58);
          g.fillText('• ' + cardData.transit, 14, 70);
          g.fillText('• ' + cardData.care, 14, 82);
          g.fillStyle = '#f59e0b'; g.font = '800 9px "Segoe UI", sans-serif';
          g.fillText('COMPRESSED SCALAR RISK: ' + cardData.risk, 14, 102);
          g.fillStyle = 'rgba(45, 212, 191, 0.2)'; g.fillRect(14, 108, w - 28, 12);
        }, { glow: 0.35 });
        K.add(new THREE.PlaneGeometry(0.8, 0.52), cardTex, [0, 1.55 - idx * 0.48, 0.02 * (idx - 1)], null, { parent: hopperGroup, shadow: false });
      })(c);
    }

    // Horizontal Brass Extrusion / Compression Roller Barrel
    var rollerGroup = new THREE.Group();
    hopperGroup.add(rollerGroup);
    rollerGroup.position.set(0, 0.22, 0);

    // Knurled black knob on the far left
    K.cyl(0.24, 0.26, 0.22, darkSteel, [-0.64, 0, 0], [0, 0, Math.PI / 2], { parent: rollerGroup, seg: 24 });
    K.cyl(0.18, 0.18, 0.12, darkSteel, [-0.78, 0, 0], [0, 0, Math.PI / 2], { parent: rollerGroup, seg: 24 });

    // Main ribbed brass compression cylinder
    K.cyl(0.32, 0.32, 1.15, brass, [0, 0, 0], [0, 0, Math.PI / 2], { parent: rollerGroup, seg: 36 });
    for (var r = -4; r <= 4; r++) {
      K.torus(0.335, 0.016, antiqueBrass, [r * 0.11, 0, 0], [0, Math.PI / 2, 0], { parent: rollerGroup });
    }

    // Lower transparent receiving tray holding compressed brass score cylinders
    K.rbox(0.92, 0.14, 0.62, acrylic, [0, -0.06, 0], null, { parent: hopperGroup, r: 0.02 });
    for (var cy = 0; cy < 4; cy++) {
      K.cyl(0.045, 0.045, 0.16, brass, [-0.28 + cy * 0.18, -0.04, 0.05 * (cy % 2 === 0 ? 1 : -1)], [0, 0, Math.PI / 2], { parent: hopperGroup });
    }

    realPlate(K, '1. Feature Compression Hopper', [-2.15, 2.1, 0.2], { w: 1.62 });

    // =========================================================================
    // STATION 2 (CENTRE: x = -0.15): Vernier Policy Micrometer Gate & Chutes
    // =========================================================================
    var gateGroup = new THREE.Group();
    ctx.root.add(gateGroup);
    gateGroup.position.set(-0.15, 0.12, 0.1);

    // Cast-iron / dark-steel arched stanchions with brass capitals
    K.rbox(0.26, 2.3, 0.44, darkSteel, [-0.85, 1.15, 0], null, { parent: gateGroup, r: 0.03 });
    K.rbox(0.26, 2.3, 0.44, darkSteel, [0.55, 1.15, 0], null, { parent: gateGroup, r: 0.03 });
    K.rbox(0.32, 0.12, 0.5, brass, [-0.85, 2.28, 0], null, { parent: gateGroup, r: 0.02 });
    K.rbox(0.32, 0.12, 0.5, brass, [0.55, 2.28, 0], null, { parent: gateGroup, r: 0.02 });

    // Top horizontal micrometer spindle cylinder with silver knurled barrel & vernier scales
    var micrometerSpindle = new THREE.Group();
    gateGroup.add(micrometerSpindle);
    micrometerSpindle.position.set(-0.15, 2.22, 0);

    K.cyl(0.18, 0.18, 1.25, acrylic, [0, 0, 0], [0, 0, Math.PI / 2], { parent: micrometerSpindle, seg: 32 });
    K.cyl(0.24, 0.26, 0.65, steel, [0.65, 0, 0], [0, 0, Math.PI / 2], { parent: micrometerSpindle, seg: 32 });
    K.cyl(0.12, 0.12, 0.28, darkSteel, [1.05, 0, 0], [0, 0, Math.PI / 2], { parent: micrometerSpindle, seg: 24 });

    var vernierTex = K.screen(160, 48, function (g, w, h) {
      g.fillStyle = '#22272b'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#d1d5db'; g.font = '700 8px "Segoe UI", sans-serif';
      g.fillText('0.0 MIN', 10, 16); g.fillText('0.5 CUTOFF', 58, 16); g.fillText('1.0 MAX', 116, 16);
      g.strokeStyle = '#e5e7eb'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(10, 24); g.lineTo(150, 24); g.stroke();
      for (var vk = 0; vk <= 14; vk++) {
        var vx = 10 + vk * 10;
        g.beginPath(); g.moveTo(vx, 24); g.lineTo(vx, vk % 5 === 0 ? 38 : 31); g.stroke();
      }
    }, { glow: 0.15 });
    K.add(new THREE.PlaneGeometry(0.62, 0.18), vernierTex, [0.65, 0, 0.27], null, { parent: micrometerSpindle, shadow: false });

    // The Sliding Guillotine Blade (moves vertically based on policy)
    var bladeHeight = policy === 0 ? 1.38 : (policy === 2 ? 0.95 : 1.16);
    var bladeGroup = new THREE.Group();
    gateGroup.add(bladeGroup);
    bladeGroup.position.set(-0.15, bladeHeight, 0);

    K.rbox(1.14, 0.96, 0.1, darkSteel, [0, 0, 0], null, { parent: bladeGroup, r: 0.02 });
    K.rbox(1.18, 0.04, 0.14, brass, [0, -0.48, 0], null, { parent: bladeGroup, r: 0.01 });

    // Dual illuminated front status displays
    var bladeCutoffBox = K.screen(88, 36, function (g, w, h) {
      g.fillStyle = '#0f172a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#38bdf8'; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4);
      g.fillStyle = '#38bdf8'; g.font = '800 11px "Segoe UI", sans-serif'; g.textAlign = 'center';
      g.fillText('CUTOFF', w / 2, 16);
      g.fillStyle = '#e2e8f0'; g.font = '700 9px "Segoe UI", sans-serif';
      g.fillText(policy === 0 ? '0.35' : (policy === 2 ? '0.70' : '0.50'), w / 2, 28);
    }, { glow: 0.3 });
    K.add(new THREE.PlaneGeometry(0.44, 0.22), bladeCutoffBox, [-0.26, 0.08, 0.06], null, { parent: bladeGroup, shadow: false });

    var policyRuleColor = policy === 0 ? '#10b981' : (policy === 2 ? '#ef4444' : '#f59e0b');
    var policyRuleText = policy === 0 ? 'INCLUSIVE' : (policy === 2 ? 'RESTRICTIVE' : 'BASELINE');
    var bladePolicyBox = K.screen(88, 36, function (g, w, h) {
      g.fillStyle = '#0f172a'; g.fillRect(0, 0, w, h);
      g.strokeStyle = policyRuleColor; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4);
      g.fillStyle = policyRuleColor; g.font = '800 10px "Segoe UI", sans-serif'; g.textAlign = 'center';
      g.fillText(policyRuleText, w / 2, 16);
      g.fillStyle = '#e2e8f0'; g.font = '700 8px "Segoe UI", sans-serif';
      g.fillText('DISCRETION', w / 2, 28);
    }, { glow: 0.3 });
    K.add(new THREE.PlaneGeometry(0.44, 0.22), bladePolicyBox, [0.26, 0.08, 0.06], null, { parent: bladeGroup, shadow: false });

    // Dual Sorting Chutes (Extending from right side of gate)
    // 1. Upper Chute (Curved down into Support Tray)
    K.rbox(0.68, 0.08, 0.42, darkSteel, [0.85, 0.95, -0.05], [0, 0, -0.32], { parent: gateGroup, r: 0.015 });

    // Support Allocated Tray
    var traySupport = new THREE.Group();
    gateGroup.add(traySupport);
    traySupport.position.set(1.42, 0.76, -0.08);

    K.rbox(0.95, 0.22, 0.68, brass, [0, 0.11, 0], null, { parent: traySupport, r: 0.025 });
    var supportSign = K.screen(110, 32, function (g, w, h) {
      g.fillStyle = '#064e3b'; g.fillRect(0, 0, w, h);
      g.strokeStyle = '#34d399'; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4);
      g.fillStyle = '#a7f3d0'; g.font = '800 9px "Segoe UI", sans-serif'; g.textAlign = 'center';
      g.fillText('SUPPORT ALLOCATED', w / 2, 14);
      g.fillStyle = '#ecfdf5'; g.font = '600 7px "Segoe UI", sans-serif';
      g.fillText('TUTORING & COACHING', w / 2, 24);
    }, { glow: 0.28 });
    K.add(new THREE.PlaneGeometry(0.85, 0.2), supportSign, [0, 0.11, 0.35], null, { parent: traySupport, shadow: false });
    for (var sa = 0; sa < 4; sa++) {
      K.rbox(0.72, 0.02, 0.48, paper, [0.02 * (sa - 1.5), 0.22 + sa * 0.024, 0], [0, sa * 0.02, 0], { parent: traySupport, r: 0.008 });
    }

    // 2. Lower Chute (Bypass slide curving beneath into Excluded Bin)
    K.rbox(0.82, 0.06, 0.38, polishedBronze, [0.82, 0.45, 0.16], [0, 0, -0.42], { parent: gateGroup, r: 0.015 });

    // Excluded Attrition Bin
    var binExcluded = new THREE.Group();
    gateGroup.add(binExcluded);
    binExcluded.position.set(1.42, 0.08, 0.18);

    K.rbox(0.98, 0.28, 0.72, polishedBronze, [0, 0.14, 0], null, { parent: binExcluded, r: 0.025 });
    var excludedSign = K.screen(110, 32, function (g, w, h) {
      g.fillStyle = policy === 2 ? '#7f1d1d' : '#78350f'; g.fillRect(0, 0, w, h);
      g.strokeStyle = policy === 2 ? '#f87171' : '#fbbf24'; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, h - 4);
      g.fillStyle = '#fef3c7'; g.font = '800 9px "Segoe UI", sans-serif'; g.textAlign = 'center';
      g.fillText('EXCLUDED ATTRITION', w / 2, 14);
      g.fillStyle = '#fffbeb'; g.font = '600 7px "Segoe UI", sans-serif';
      g.fillText('FILTERED FROM SUPPORT', w / 2, 24);
    }, { glow: 0.28 });
    K.add(new THREE.PlaneGeometry(0.88, 0.22), excludedSign, [0, 0.14, 0.37], null, { parent: binExcluded, shadow: false });
    for (var ex = 0; ex < 5; ex++) {
      K.cyl(0.045, 0.045, 0.16, darkSteel, [-0.25 + ex * 0.12, 0.18, 0.08 * (ex % 2 === 0 ? 1 : -1)], [0, 0, Math.PI / 2], { parent: binExcluded });
    }

    realPlate(K, '2. Vernier Policy Micrometer Gate', [-0.15, 2.1, 0.2], { w: 1.7, warn: policy === 2 });

    // =========================================================================
    // STATION 3 (RIGHT: x = 2.2): Precision Analytical Balance & Articulated Loupe
    // =========================================================================
    var balanceGroup = new THREE.Group();
    ctx.root.add(balanceGroup);
    balanceGroup.position.set(2.2, 0.12, 0.1);

    // Cast-iron central balance stand & pedestal
    K.rbox(0.92, 0.08, 0.44, darkSteel, [0, 0.04, 0], null, { parent: balanceGroup, r: 0.02 });
    K.cyl(0.042, 0.052, 1.48, darkSteel, [0, 0.78, 0], null, { parent: balanceGroup, seg: 24 });
    K.torus(0.08, 0.016, brass, [0, 1.48, 0], [Math.PI / 2, 0, 0], { parent: balanceGroup });

    // Pivot Knife-edge & Horizontal Balance Beam
    var beamTilt = view === 'explain' ? 0.09 : (policy === 2 ? -0.07 : 0);
    var beamGroup = new THREE.Group();
    balanceGroup.add(beamGroup);
    beamGroup.position.set(0, 1.48, 0);
    beamGroup.rotation.z = beamTilt;

    K.box(1.58, 0.038, 0.045, darkSteel, [0, 0, 0], null, { parent: beamGroup });
    K.cyl(0.028, 0.028, 0.07, brass, [-0.74, 0, 0], null, { parent: beamGroup, seg: 16 });
    K.cyl(0.028, 0.028, 0.07, brass, [0.74, 0, 0], null, { parent: beamGroup, seg: 16 });

    // Left Pan Assembly: Cold Brass Algorithm Score Cylinder
    var panLeft = new THREE.Group();
    balanceGroup.add(panLeft);
    panLeft.position.set(-0.74, 1.48 - Math.sin(beamTilt) * 0.74 - 0.65, 0);

    K.cyl(0.008, 0.008, 0.58, steel, [0, 0.32, 0], null, { parent: panLeft, seg: 12 });
    K.cyl(0.26, 0.28, 0.035, brass, [0, 0.02, 0], null, { parent: panLeft, seg: 32 });
    // Heavy cold brass cylinder: Risk Score
    K.cyl(0.13, 0.13, 0.42, brass, [0, 0.24, 0], null, { parent: panLeft, seg: 32 });

    // Right Pan Assembly: Open Student Context Notebook
    var panRight = new THREE.Group();
    balanceGroup.add(panRight);
    panRight.position.set(0.74, 1.48 + Math.sin(beamTilt) * 0.74 - 0.65, 0);

    K.cyl(0.008, 0.008, 0.58, steel, [0, 0.32, 0], null, { parent: panRight, seg: 12 });
    K.cyl(0.26, 0.28, 0.035, brass, [0, 0.02, 0], null, { parent: panRight, seg: 32 });

    // The Open Student Context Notebook
    var notebook = new THREE.Group();
    panRight.add(notebook);
    notebook.position.set(0, 0.08, 0);
    K.rbox(0.52, 0.032, 0.42, paper, [0, 0, 0], null, { parent: notebook, r: 0.01 });

    var noteTex = K.screen(140, 96, function (g, w, h) {
      g.fillStyle = '#fefcf8'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#dc2626'; g.fillRect(16, 0, 2, h);
      g.strokeStyle = '#cbd5e1'; g.lineWidth = 1;
      for (var nl = 16; nl < h; nl += 10) { g.beginPath(); g.moveTo(0, nl); g.lineTo(w, nl); g.stroke(); }
      g.fillStyle = '#0f172a'; g.font = '800 9px "Segoe UI", sans-serif';
      g.fillText('STUDENT CONTEXT DOSSIER', 24, 16);
      g.fillStyle = '#475569'; g.font = '600 7px "Segoe UI", sans-serif';
      g.fillText('Caregiving: 28 hrs/wk sibling care', 24, 30);
      g.fillText('Employment: Night nursing aide shift', 24, 42);
      g.fillText('Transit: 2 bus routes each way', 24, 54);
      g.fillStyle = '#059669'; g.font = '800 8px "Segoe UI", sans-serif';
      g.fillText('ADVISOR OVERRIDE: APPROVED', 24, 72);
      g.fillStyle = '#2563eb'; g.font = '700 7px "Segoe UI", sans-serif';
      g.fillText('DIRECT TO TUTORING WING', 24, 84);
    }, { glow: 0.18 });
    K.add(new THREE.PlaneGeometry(0.48, 0.36), noteTex, [0, 0.022, 0], [-Math.PI / 2, 0, 0], { parent: notebook, shadow: false });

    // Articulated Brass Inspection Lamp / Loupe Arm
    var loupeGroup = new THREE.Group();
    balanceGroup.add(loupeGroup);
    loupeGroup.position.set(0.68, 0.06, 0.32);

    K.cyl(0.14, 0.16, 0.045, brass, [0, 0.02, 0], null, { parent: loupeGroup, seg: 24 });
    K.cyl(0.018, 0.018, 0.58, brass, [0, 0.31, 0], null, { parent: loupeGroup, seg: 16 });
    K.torus(0.08, 0.018, antiqueBrass, [-0.08, 0.58, 0], [0, 0, Math.PI / 2], { parent: loupeGroup });
    K.cyl(0.016, 0.016, 0.44, brass, [-0.22, 0.68, -0.08], [0.35, 0, 0.45], { parent: loupeGroup, seg: 16 });

    // The Circular Magnifying Loupe
    var loupeHead = new THREE.Group();
    loupeGroup.add(loupeHead);
    loupeHead.position.set(-0.35, 0.82, -0.16);
    loupeHead.rotation.set(Math.PI / 4, 0, 0.2);

    K.torus(0.14, 0.025, antiqueBrass, [0, 0, 0], null, { parent: loupeHead });
    K.cyl(0.13, 0.13, 0.012, acrylic, [0, 0, 0], [Math.PI / 2, 0, 0], { parent: loupeHead, shadow: false });

    realPlate(K, '3. Equity Balance & Recourse', [2.2, 2.1, 0.2], { w: 1.62 });

    // =========================================================================
    // 5. DYNAMIC MULTISTRAND PARTICLE FLOWS (Direct Cause & Effect)
    // =========================================================================
    // Stream 1: Intake dossier particles into compression roller
    K.flow([
      [-2.15, 1.65, 0.08],
      [-2.15, 0.85, 0.08],
      [-2.15, 0.35, 0.08]
    ], {
      color: 0x2dd4bf, pulseColor: 0x99f6e4,
      pulses: 3, speed: 0.08, radius: 0.018
    });

    // Stream 2: Extrusion stream entering the micrometer gate
    K.flow([
      [-2.0, 0.32, 0.08],
      [-1.1, 0.45, 0.1],
      [-0.15, 0.55, 0.1]
    ], {
      color: 0xd4af37, pulseColor: 0xfef08a,
      pulses: 4, speed: 0.09, radius: 0.018
    });

    // Stream 3A: Upper sorting branch passing through into SUPPORT ALLOCATED
    var supportPulses = policy === 0 ? 5 : (policy === 2 ? 1 : 3);
    K.flow([
      [-0.15, 0.75, 0.1],
      [0.65, 0.95, 0.0],
      [1.42, 0.92, -0.08]
    ], {
      color: 0x10b981, pulseColor: 0x6ee7b7,
      pulses: supportPulses, speed: 0.075, radius: 0.018
    });

    // Stream 3B: Lower sorting branch plunging into EXCLUDED ATTRITION
    var excludedPulses = policy === 2 ? 6 : (policy === 0 ? 1 : 3);
    K.flow([
      [-0.15, 0.55, 0.1],
      [0.65, 0.42, 0.16],
      [1.42, 0.24, 0.18]
    ], {
      color: policy === 2 ? 0xef4444 : 0xf59e0b, pulseColor: 0xfca5a5,
      pulses: excludedPulses, speed: 0.085, radius: 0.018
    });

    // Stream 4: Human Recourse Loop (Active in explain view or when override engaged)
    if (view === 'explain' || path) {
      K.flow([
        [1.42, 0.25, 0.18],
        [2.0, 0.85, 0.25],
        [2.2, 1.45, 0.1],
        [1.85, 1.35, -0.05],
        [1.42, 0.95, -0.08]
      ], {
        color: 0x38bdf8, pulseColor: 0xfde047,
        pulses: 4, speed: 0.065, radius: 0.02
      });
    }
  };
  REAL_SIGNATURES.thresholdaudit = 'bfs218-w10-policy-sieve-balance-real-v1';

  /* Week 11: a community wireless-network studio based on the documented DCTP
     case. The network, tools, maintenance cabinet, and governance binder show
     four resident roles rather than reducing co-design to an empty chair. */
  REAL_SCENES.repairtable = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn, steel = K.real.surface('darkSteel'), brushed = K.real.surface('steel'), paper = K.real.surface('paper');
    K.rbox(6.7, 2.05, 0.16, K.real.surface('concrete'), [0, 1.0, -2.18], null, { r: 0.026 });
    K.real.table([0, 0, 0.18], { w: 6.2, d: 1.75, h: 0.68, top: K.real.surface('oak') });
    var xs = [-2.3, -0.8, 0.75, 2.3];
    var roles = ['LEARN', 'DESIGN', 'BUILD + MAINTAIN', 'GOVERN'];
    xs.forEach(function (x, i) { realPlate(K, roles[i], [x, 1.7, -0.55], { w: i === 2 ? 1.28 : 0.9, warn: hot && i === 3 }); });
    K.rbox(0.92, 0.66, 0.62, steel, [xs[0], 1.02, 0], null, { r: 0.04 });
    var learn = K.screen(96, 64, function (g, w, h) { g.fillStyle = '#152126'; g.fillRect(0, 0, w, h); g.fillStyle = '#b8c6c3'; g.font = '700 8px "Segoe UI", sans-serif'; g.fillText('NETWORK SKILLS', 9, 14); g.strokeStyle = '#5d8880'; g.lineWidth = 2; g.beginPath(); g.moveTo(12, 48); g.lineTo(34, 28); g.lineTo(58, 43); g.lineTo(82, 20); g.stroke(); }, { glow: 0.2 });
    K.add(new K.THREE.PlaneGeometry(0.74, 0.48), learn, [xs[0], 1.05, 0.325], null, { shadow: false });
    K.rbox(0.92, 0.06, 0.7, paper, [xs[1], 0.82, 0], [0, -0.12, 0], { r: 0.012 });
    for (var n = 0; n < 4; n++) { var nx = xs[1] - 0.28 + (n % 2) * 0.56, nz = -0.2 + Math.floor(n / 2) * 0.4; K.sph(0.055, K.real.accent(path ? PAL.green : PAL.teal, false), [nx, 0.94, nz]); }
    K.flow([[xs[1] - 0.28, 0.95, -0.2], [xs[1] + 0.28, 0.95, -0.2], [xs[1] + 0.28, 0.95, 0.2], [xs[1] - 0.28, 0.95, 0.2]], { color: path ? PAL.green : PAL.teal, pulseColor: PAL.amber, pulses: 3, speed: 0.07, radius: 0.012 });
    K.rbox(0.9, 0.44, 0.65, steel, [xs[2], 0.98, 0], null, { r: 0.035 });
    K.cyl(0.05, 0.06, 0.82, brushed, [xs[2], 1.47, 0], null, { seg: 28 });
    K.torus(0.22, 0.026, K.real.accent(path ? PAL.green : PAL.amber, false), [xs[2], 1.72, 0], [Math.PI / 2, 0, 0]);
    K.rbox(0.88, 0.09, 0.66, K.real.surface('leather'), [xs[3], 0.82, 0], null, { r: 0.025 });
    for (var pg = 0; pg < 4; pg++) K.rbox(0.7, 0.016, 0.52, paper, [xs[3], 0.88 + pg * 0.024, 0], null, { r: 0.006 });
    K.cyl(0.16, 0.16, 0.045, K.real.accent(hot ? PAL.red : path ? PAL.green : PAL.amber, hot), [xs[3], 1.0, 0], null, { seg: 44 });
    K.flow([[xs[0] + 0.45, 1.18, 0], [xs[1] - 0.45, 1.18, 0], [xs[1] + 0.45, 1.18, 0], [xs[2] - 0.45, 1.18, 0], [xs[2] + 0.45, 1.18, 0], [xs[3] - 0.45, 1.18, 0]], { color: hot ? PAL.red : path ? PAL.green : PAL.teal, pulseColor: hot ? PAL.red : PAL.amber, pulses: 5, speed: 0.075, radius: 0.014 });
  };
  REAL_SIGNATURES.repairtable = 'bfs218-w11-dctp-community-network-real-v1';

  /* Week 12: a parliamentary evidence desk. The proposal binder remains a
     historical file; five physical tabs connect argued gaps to institutional
     recommendations without pretending that AIDA became law. */
  REAL_SCENES.policydeck = function (K, ctx) {
    K.stage({ style: 'realist' });
    var hot = ctx.riskOn, path = ctx.pathOn, steel = K.real.surface('darkSteel'), paper = K.real.surface('paper');
    K.rbox(6.7, 2.05, 0.16, K.real.surface('concrete'), [0, 1.0, -2.18], null, { r: 0.026 });
    K.real.table([0, 0, 0.2], { w: 6.2, d: 1.75, h: 0.68, top: K.real.surface('oak') });
    var binder = new K.THREE.Group(); ctx.root.add(binder); binder.position.set(-2.25, 0.78, 0.05); binder.rotation.y = 0.12;
    K.rbox(1.32, 0.1, 0.9, K.real.surface('leather'), [0, 0, 0], null, { parent: binder, r: 0.035 });
    for (var p = 0; p < 6; p++) K.rbox(1.08, 0.016, 0.72, paper, [0.04, 0.07 + p * 0.023, 0], null, { parent: binder, r: 0.007 });
    var status = K.screen(142, 90, function (g, w, h) { g.fillStyle = '#eee8dc'; g.fillRect(0, 0, w, h); g.fillStyle = '#303331'; g.font = '800 15px "Segoe UI", sans-serif'; g.fillText('AIDA PROPOSAL', 12, 22); g.fillStyle = '#982f29'; g.fillRect(12, 35, 118, 18); g.fillStyle = '#fff'; g.font = '800 11px "Segoe UI", sans-serif'; g.fillText('DID NOT BECOME LAW', 18, 48); g.fillStyle = '#646863'; g.font = '600 8px "Segoe UI", sans-serif'; g.fillText('HISTORICAL FILE', 12, 73); }, { glow: 0.04 });
    K.add(new K.THREE.PlaneGeometry(1.02, 0.64), status, [-2.2, 0.92, 0.07], [-Math.PI / 2, 0.12, 0], { shadow: false });
    realPlate(K, 'Proposal status', [-2.25, 1.62, 0.32], { w: 1.08, warn: true });
    var gapNames = ['DETAIL', 'PUBLIC', 'OVERSIGHT', 'CAPACITY', 'SCOPE'];
    for (var i = 0; i < 5; i++) {
      var x = -0.8 + i * 0.68;
      K.rbox(0.52, 0.09, 0.72, i === (hot ? 2 : path ? 1 : 0) ? K.real.accent(hot ? PAL.red : PAL.teal, hot) : K.real.surface('limestone'), [x, 0.8, 0], null, { r: 0.02 });
      K.rbox(0.4, 0.016, 0.56, paper, [x, 0.87, 0], null, { r: 0.006 });
      realPlate(K, gapNames[i], [x, 1.35, 0.25], { w: 0.58, h: 0.18, warn: hot && i === 2 });
    }
    K.real.frame([2.45, 0.7, 0], { w: 0.88, h: 0.94, d: 0.22, beam: 0.08, light: hot ? PAL.red : path ? PAL.green : PAL.amber });
    K.rbox(0.66, 0.07, 0.52, paper, [2.45, 0.88, 0], [0, -0.08, 0], { r: 0.012 });
    K.cyl(0.18, 0.2, 0.06, steel, [2.45, 1.05, 0], null, { seg: 40 });
    realPlate(K, 'Institutional response', [2.45, 1.65, 0.2], { w: 1.25, warn: hot });
    K.flow([[-1.58, 1.06, 0], [-0.95, 1.2, 0], [0.5, 1.16, 0], [1.65, 1.15, 0], [2.02, 1.22, 0]], { color: hot ? PAL.red : path ? PAL.green : PAL.teal, pulseColor: hot ? PAL.red : PAL.amber, pulses: 4, speed: 0.075, radius: 0.014 });
  };
  REAL_SIGNATURES.policydeck = 'bfs218-w12-aida-evidence-docket-real-v1';

  var REAL_ASSETS = {
    thresholdaudit: 'images/story/bfs218-w10-policy-sieve.jpg'
  };
  function renderedActivityEnvironment(K, ctx) {
    var THREE = K.THREE;
    var asset = REAL_ASSETS[ctx.kind];
    ctx.root.userData.renderAsset = asset;
    ctx.root.userData.interactiveShapes = 3;
    ctx.canvas.setAttribute('data-render-asset', asset);
    ctx.canvas.setAttribute('data-render-view', ctx.view || 'predict');
    ctx.canvas.setAttribute('data-interactive-shapes', '3');
    ctx.renderer.setClearColor(0x000000, 0);
    ctx.scene.fog = null;
    if (!ctx.camera.parent) ctx.scene.add(ctx.camera);

    var overlay = new THREE.Group();
    overlay.name = 'bfs-rendered-activity-controls';
    ctx.camera.add(overlay);
    var picks = [], nodes = [];
    var modes = ['predict', 'try', 'explain'];
    var positions = ctx.kind === 'mechanismatch'
      ? [[-1.38, -0.62, -4], [-0.72, -0.16, -4], [0.9, 0.08, -4]]
      : (ctx.kind === 'thresholdaudit'
        ? [[-1.32, -0.28, -3.8], [-0.08, -0.20, -3.8], [1.18, -0.26, -3.8]]
        : [[-1.24, -0.48, -4], [0.02, -0.54, -4], [0.86, 0.16, -4]]);
    var colours = ctx.kind === 'thresholdaudit'
      ? [0x2dd4bf, 0xd4af37, 0x10b981]
      : [0xa67a42, 0x4f7977, 0x6f2824];
    function material(colour, active, glass) {
      return new THREE.MeshPhysicalMaterial({
        color: colour,
        metalness: glass ? 0.08 : 0.72,
        roughness: glass ? 0.12 : 0.24,
        clearcoat: 0.75,
        clearcoatRoughness: 0.16,
        transmission: glass ? 0.46 : 0,
        transparent: !!glass,
        opacity: glass ? 0.62 : 1,
        emissive: active ? colour : 0x000000,
        emissiveIntensity: active ? 0.24 : 0
      });
    }
    function addMesh(parent, geometry, mat, pos, rot) {
      var mesh = new THREE.Mesh(geometry, mat);
      if (pos) mesh.position.set(pos[0], pos[1], pos[2]);
      if (rot) mesh.rotation.set(rot[0], rot[1], rot[2]);
      parent.add(mesh);
      return mesh;
    }
    function link(parent, a, b, mat, radius) {
      var dx = b[0] - a[0], dy = b[1] - a[1];
      var length = Math.sqrt(dx * dx + dy * dy);
      return addMesh(parent, new THREE.CylinderGeometry(radius || 0.018, radius || 0.018, length, 18), mat, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0], [0, 0, -Math.atan2(dx, dy)]);
    }
    function documentShape(parent, mat) {
      addMesh(parent, new THREE.BoxGeometry(0.36, 0.235, 0.038), material(0x353735, false, false), [0, -0.012, 0]);
      for (var page = 0; page < 3; page++) {
        addMesh(parent, new THREE.BoxGeometry(0.3, 0.195, 0.008), material(0xe8e0cf, false, false), [0.014 + page * 0.006, 0.018 + page * 0.005, 0.028 + page * 0.009], [0, 0, -0.045 + page * 0.018]);
      }
      addMesh(parent, new THREE.BoxGeometry(0.09, 0.028, 0.035), mat, [0.018, 0.112, 0.066]);
      for (var line = 0; line < 3; line++) addMesh(parent, new THREE.BoxGeometry(0.17 - line * 0.018, 0.009, 0.009), material(0x6f6a61, false, false), [0.018, 0.058 - line * 0.052, 0.066]);
      var sheet = parent.children[parent.children.length - 1];
      return sheet;
    }
    function lensShape(parent, mat) {
      addMesh(parent, new THREE.TorusGeometry(0.18, 0.032, 18, 72), mat);
      addMesh(parent, new THREE.CircleGeometry(0.145, 56), material(0x9fdde0, false, true), [0, 0, -0.012]);
      link(parent, [-0.13, -0.17], [-0.27, -0.34], mat, 0.025);
    }
    function gearShape(parent, mat) {
      addMesh(parent, new THREE.TorusGeometry(0.145, 0.038, 18, 64), mat);
      addMesh(parent, new THREE.CylinderGeometry(0.047, 0.047, 0.055, 28), mat, [0, 0, 0], [Math.PI / 2, 0, 0]);
      for (var tooth = 0; tooth < 10; tooth++) {
        var angle = tooth * Math.PI * 2 / 10;
        addMesh(parent, new THREE.BoxGeometry(0.055, 0.085, 0.055), mat, [Math.cos(angle) * 0.19, Math.sin(angle) * 0.19, 0], [0, 0, angle]);
      }
      addMesh(parent, new THREE.TorusGeometry(0.27, 0.018, 14, 64), material(0xb99255, false, false), [0, 0, -0.02]);
    }
    function leverShape(parent, mat) {
      addMesh(parent, new THREE.BoxGeometry(0.34, 0.085, 0.08), material(0x4b4b49, false, false), [0, -0.16, 0]);
      var arm = new THREE.Group(); parent.add(arm); arm.rotation.z = -0.42;
      link(arm, [0, -0.12], [0, 0.22], mat, 0.028);
      addMesh(arm, new THREE.SphereGeometry(0.065, 28, 20), mat, [0, 0.25, 0]);
      parent.userData.arm = arm;
    }
    function forkShape(parent, mat) {
      link(parent, [0, -0.25], [0, -0.02], mat, 0.025);
      link(parent, [0, -0.02], [-0.18, 0.22], material(0x5c8b68, true, false), 0.027);
      link(parent, [0, -0.02], [0.18, 0.22], material(0xa53b33, true, false), 0.027);
      addMesh(parent, new THREE.SphereGeometry(0.045, 24, 18), mat, [0, -0.02, 0]);
    }
    function hopperShape(parent, mat) {
      addMesh(parent, new THREE.BoxGeometry(0.34, 0.44, 0.16), material(0x2dd4bf, false, true), [0, 0.08, 0]);
      for (var cd = 0; cd < 3; cd++) {
        addMesh(parent, new THREE.BoxGeometry(0.26, 0.34, 0.008), material(0x5eead4, true, false), [0, 0.14 - cd * 0.06, 0.015 * cd], [0, 0, -0.02]);
      }
      addMesh(parent, new THREE.CylinderGeometry(0.07, 0.07, 0.38, 24), material(0xd4af37, false, false), [0, -0.16, 0], [0, 0, Math.PI / 2]);
      addMesh(parent, new THREE.TorusGeometry(0.078, 0.01, 10, 32), material(0xb89535, false, false), [-0.1, -0.16, 0], [0, Math.PI / 2, 0]);
      addMesh(parent, new THREE.TorusGeometry(0.078, 0.01, 10, 32), material(0xb89535, false, false), [0.1, -0.16, 0], [0, Math.PI / 2, 0]);
    }
    function micrometerShape(parent, mat) {
      addMesh(parent, new THREE.CylinderGeometry(0.07, 0.07, 0.46, 28), material(0x9ca3af, false, false), [0.08, 0.14, 0], [0, 0, Math.PI / 2]);
      addMesh(parent, new THREE.CylinderGeometry(0.09, 0.09, 0.18, 28), material(0x6b7280, false, false), [0.27, 0.14, 0], [0, 0, Math.PI / 2]);
      var blade = addMesh(parent, new THREE.BoxGeometry(0.42, 0.36, 0.035), material(0x27272a, true, false), [0, -0.08, 0]);
      addMesh(blade, new THREE.BoxGeometry(0.44, 0.024, 0.045), material(0xd4af37, false, false), [0, -0.17, 0]);
      parent.userData.gateBlade = blade;
    }
    function balanceShape(parent, mat) {
      addMesh(parent, new THREE.CylinderGeometry(0.025, 0.035, 0.52, 20), material(0xb89535, false, false), [0, 0, 0]);
      addMesh(parent, new THREE.CylinderGeometry(0.08, 0.1, 0.04, 24), material(0x27272a, false, false), [0, -0.25, 0]);
      var beam = new THREE.Group(); parent.add(beam); beam.position.set(0, 0.24, 0);
      addMesh(beam, new THREE.BoxGeometry(0.56, 0.025, 0.025), material(0xd4af37, false, false), [0, 0, 0]);
      link(beam, [-0.22, 0], [-0.22, -0.22], mat, 0.012);
      addMesh(beam, new THREE.CylinderGeometry(0.09, 0.09, 0.015, 24), material(0xd4af37, false, false), [-0.22, -0.22, 0]);
      addMesh(beam, new THREE.CylinderGeometry(0.04, 0.04, 0.08, 20), material(0xb89535, false, false), [-0.22, -0.17, 0]);
      link(beam, [0.22, 0], [0.22, -0.22], mat, 0.012);
      addMesh(beam, new THREE.CylinderGeometry(0.09, 0.09, 0.015, 24), material(0xd4af37, false, false), [0.22, -0.22, 0]);
      addMesh(beam, new THREE.BoxGeometry(0.12, 0.022, 0.08), material(0xfef08a, false, false), [0.22, -0.20, 0]);
      addMesh(parent, new THREE.TorusGeometry(0.065, 0.012, 12, 32), material(0xd4af37, false, false), [0.28, 0.06, 0.05], [0.2, 0.3, 0]);
      addMesh(parent, new THREE.CircleGeometry(0.055, 24), material(0x9fdde0, false, true), [0.28, 0.06, 0.05], [0.2, 0.3, 0]);
      parent.userData.beam = beam;
    }
    positions.forEach(function (position, index) {
      var group = new THREE.Group();
      group.position.set(position[0], position[1], position[2]);
      overlay.add(group);
      var active = modes[index] === (ctx.view || 'predict');
      var mat = material(colours[index], active, false);
      var halo = addMesh(group, new THREE.TorusGeometry(0.31, 0.014, 14, 72), material(colours[index], active, false), [0, 0, -0.035]);
      halo.material.transparent = true; halo.material.opacity = active ? 0.88 : 0.5;
      var visual = new THREE.Group(); group.add(visual);
      if (ctx.kind === 'mechanismatch') {
        if (index === 0) documentShape(visual, mat);
        else if (index === 1) lensShape(visual, mat);
        else gearShape(visual, mat);
      } else if (ctx.kind === 'thresholdaudit') {
        if (index === 0) hopperShape(visual, mat);
        else if (index === 1) micrometerShape(visual, mat);
        else balanceShape(visual, mat);
      } else {
        if (index === 0) documentShape(visual, mat);
        else if (index === 1) leverShape(visual, mat);
        else forkShape(visual, mat);
      }
      var hit = addMesh(group, new THREE.SphereGeometry(0.37, 24, 18), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.userData.storyView = modes[index];
      var announcement = ctx.kind === 'thresholdaudit'
        ? (index === 0 ? 'Station 1: Feature compression hopper selected. Multidimensional context flattened into scalar scores.'
          : (index === 1 ? 'Station 2: Vernier cutoff gate selected. Institutional discretion sets the support threshold.'
          : 'Station 3: Equity balance selected. Human review weighs cold prediction against lived context.'))
        : (index === 0 ? 'Input or outcome selected.' : index === 1 ? 'System mechanism selected.' : 'Consequence selected.');
      picks.push({ mesh: hit, view: modes[index], announcement: announcement });
      nodes.push({ group: group, visual: visual, halo: halo, hit: hit, mat: mat, mode: modes[index], index: index, turnX: 0, turnY: 0, spinZ: 0, leverShift: 0, dragX: 0, dragY: 0 });
    });
    var activeNode = nodes[0];
    function setMode(mode) {
      ctx.canvas.setAttribute('data-render-view', mode);
      var shell = ctx.canvas.closest && ctx.canvas.closest('.wk-model-shell');
      if (shell) shell.setAttribute('data-render-view', mode);
      nodes.forEach(function (node) {
        var active = node.mode === mode;
        if (active) activeNode = node;
        node.mat.emissive.setHex(active ? node.mat.color.getHex() : 0x000000);
        node.mat.emissiveIntensity = active ? 0.17 : 0;
        node.halo.material.opacity = active ? 0.68 : 0.3;
        var visualScale = active ? 0.82 : 0.7;
        node.group.scale.setScalar(visualScale);
        node.hit.scale.setScalar(1 / visualScale);
      });
    }
    function manipulate(dx, dy) {
      if (!activeNode) return;
      if (ctx.kind === 'mechanismatch') {
        if (activeNode.index === 0) {
          activeNode.dragX = Math.max(0, Math.min(0.58, activeNode.dragX + dx * 0.0048));
          activeNode.dragY = Math.max(-0.12, Math.min(0.12, activeNode.dragY - dy * 0.003));
          activeNode.turnY += dx * 0.006;
        } else if (activeNode.index === 1) {
          activeNode.dragX = Math.max(-0.42, Math.min(0.58, activeNode.dragX + dx * 0.0048));
          activeNode.dragY = Math.max(-0.18, Math.min(0.18, activeNode.dragY - dy * 0.004));
          activeNode.turnY += dx * 0.011;
          activeNode.turnX = Math.max(-0.42, Math.min(0.42, activeNode.turnX + dy * 0.007));
        } else {
          activeNode.spinZ += dx * 0.02;
          activeNode.turnY += dy * 0.006;
        }
      } else if (ctx.kind === 'thresholdaudit') {
        if (activeNode.index === 0) {
          activeNode.dragY = Math.max(-0.25, Math.min(0.25, activeNode.dragY - dy * 0.003));
          activeNode.turnY += dx * 0.006;
        } else if (activeNode.index === 1) {
          activeNode.leverShift = Math.max(-0.35, Math.min(0.35, activeNode.leverShift - dy * 0.004));
          activeNode.turnY += dx * 0.008;
        } else {
          activeNode.spinZ = Math.max(-0.32, Math.min(0.32, activeNode.spinZ + dx * 0.008));
          activeNode.turnY += dy * 0.005;
        }
      } else if (activeNode.index === 0) {
        activeNode.dragX = Math.max(0, Math.min(0.72, activeNode.dragX + dx * 0.005));
        activeNode.dragY = Math.max(-0.1, Math.min(0.1, activeNode.dragY - dy * 0.0025));
        activeNode.turnY += dx * 0.005;
      } else if (activeNode.index === 1) {
        activeNode.leverShift = Math.max(-0.62, Math.min(0.62, activeNode.leverShift + dx * 0.012));
      } else {
        activeNode.dragX = Math.max(-0.38, Math.min(0.38, activeNode.dragX + dx * 0.005));
        activeNode.spinZ = Math.max(-0.48, Math.min(0.48, activeNode.spinZ + dx * 0.008));
      }
      ctx.canvas.setAttribute('data-shape-manipulated', activeNode.mode);
    }
    function manipulationState() {
      return nodes.map(function (node) { return { view: node.mode, turnX: node.turnX, turnY: node.turnY, spinZ: node.spinZ, leverShift: node.leverShift, dragX: node.dragX, dragY: node.dragY }; });
    }
    function resetManipulation() {
      nodes.forEach(function (node) {
        node.turnX = 0;
        node.turnY = 0;
        node.spinZ = 0;
        node.leverShift = 0;
        node.dragX = 0;
        node.dragY = 0;
      });
      setMode('predict');
      ctx.canvas.setAttribute('data-render-view', 'predict');
      ctx.canvas.removeAttribute('data-shape-manipulated');
    }
    setMode(ctx.view || 'predict');
    K.onTick(function (time) {
      nodes.forEach(function (node, index) {
        var active = ctx.canvas.getAttribute('data-render-view') === node.mode;
        node.visual.rotation.y = node.turnY + (active ? Math.sin(time * 0.8 + index) * 0.18 : Math.sin(time * 0.35 + index) * 0.05);
        node.visual.rotation.x = node.turnX + (active ? Math.sin(time * 0.55 + index) * 0.045 : 0);
        node.visual.rotation.z = node.spinZ;
        node.group.position.x = positions[index][0] + node.dragX;
        node.group.position.y = positions[index][1] + node.dragY + Math.sin(time * 1.1 + index) * (active ? 0.025 : 0.009);
        if (node.visual.userData.arm) node.visual.userData.arm.rotation.z = -0.42 + node.leverShift + Math.sin(time * 0.9) * 0.06;
        if (node.visual.userData.gateBlade) node.visual.userData.gateBlade.position.y = -0.08 + node.leverShift + (active ? Math.sin(time * 1.5) * 0.015 : 0);
        if (node.visual.userData.beam) node.visual.userData.beam.rotation.z = node.spinZ + (active ? Math.sin(time * 1.2) * 0.06 : Math.sin(time * 0.6) * 0.02);
      });
    });
    return {
      setMode: setMode,
      manipulate: manipulate,
      resetManipulation: resetManipulation,
      manipulationState: manipulationState,
      pickMeshes: picks
    };
  }


  /* in-scene labels: what each key object IS (comprehension first) */
  var TAGS = {
    map: [['A STUDENT', [0, 1.15, 0]], ['PHONE', [-1.9, 1.25, 1.0]], ['CAMERA', [-2.0, 2.05, -1.2]], ['TAP TO PAY', [1.95, 1.15, 1.05]], ['ID CHECK', [2.0, 1.55, -1.15]], ['YOUR NOTICING MAP', [0, 1.0, 1.85]]],
    /* Week 2 uses physical documents and the adjacent semantic caption. */
    outcomelens: function () { return []; },
    pipeline: [['OLD RECORDS', [-2.5, 1.5, -0.1]], ['CONVEYOR', [-1.0, 0.75, 0]], ['SCORING RULE', [0.55, 1.75, 0]], ['APPROVED', [2.45, 0.95, -0.75]], ['DENIED', [2.45, 0.95, 0.75], 1]],
    switches: [['DEFAULT SETTINGS', [-0.55, 1.95, -0.4]], ['THE DOOR', [2.3, 1.95, -0.15]], ['FITS THE DEFAULT', [1.45, 1.35, 0.35]], ['MUST ADAPT', [1.35, 1.35, 1.35], 1]],
    audit: [['1. OVERALL AVERAGE', [1.55, 2.05, -0.9]], ['2. CHECK EACH GROUP', [-0.55, 1.02, 0]]],
    gate: [['CHECKPOINT', [0, 2.25, 0]], ['CAMERAS', [-0.95, 2.25, -0.45]], ['FLAGGED', [0, 1.75, 0.9], 1], ['DATABASES', [2.45, 1.75, -0.2]], ['WHO DECIDES?', [-2.3, 1.65, 0.9]]],
    review: [['WEEKS 1 TO 6', [0, 1.55, -1.3]], ['THE PATTERN RETURNS', [0, 2.0, 0]], ['REST IS PART OF IT', [0, 0.95, 1.5]]],
    vault: [['DATA VAULT', [-1.5, 2.35, -0.55]], ['STORIES ABOUT PEOPLE', [0.4, 1.85, 0.4]], ['THE KEY = CONTROL', [1.75, 1.25, 0.85]], ['THE COMMUNITY', [1.55, 1.35, 1.8]]],
    /* Weeks 9 and 11 use physical documents; floating labels would obscure them. */
    benevolence: function () { return []; },
    sorting: [['STUDENT RECORDS', [-1.75, 1.05, 0]], ['THE CUTOFF', [0, 1.95, 0], 1], ['GETS SUPPORT', [2.0, 1.05, -1.1]], ['LEFT WAITING', [1.75, 1.05, 1.2], 1]],
    repair: function () { return []; },
    policy: [['THE PRODUCT', [1.6, 0.45, 0]], ['THE INSTITUTION', [1.35, 0.9, 0]], ['THE LAW', [1.15, 1.35, 0]], ['RIGHTS', [0.95, 1.8, 0]], ['THE GAP', [1.35, 1.5, 0.55], 1], ['LEFT EXPOSED', [2.05, 1.35, 1.1], 1]],
    'return': [['WEEK 1: FIRST NOTES', [2.1, 0.95, -1.15]], ['YOUR CLIMB', [0, 2.15, 0]], ['WEEK 13: WHAT YOU SEE NOW', [-0.4, 2.25, 0.75]]],
    compass: [['THE COURSE QUESTION', [-1.5, 1.55, -1.5]], ['YOUR MAP', [1.55, 1.55, 1.5]], ['YOUR ANSWER POINTS FORWARD', [0, 1.05, 0]], ['YOU, GOING ON', [1.1, 1.45, -1.75]]],
    startermap: [['1. PICK ONE TOOL', [-2.0, 1.15, -0.65]], ['2. ASK WHAT IT ASSUMES', [-0.85, 1.45, -0.15]], ['3. RECORD YOUR FIRST MAP ENTRY', [0.35, 1.15, 0.55]]],
    matchwork: [['THE EXAMPLE', [-2.05, 1.45, -0.35]], ['YOUR CHOICE', [-0.2, 1.0, 0.35]], ['COURSE IDEAS', [1.95, 1.15, 0]], ['FEEDBACK', [2.75, 1.15, 0]]],
    mechanismatch: [['1. OPEN THE CASE FILE', [-2.2, 1.15, -0.4]], ['2. APPLY THE OUTCOMES LENS', [-0.45, 1.95, 0]], ['3. IDENTIFY THE MECHANISMS', [1.85, 1.35, 0]]],
    decisionpath: [['1. INPUT', [-2.15, 1.35, 0]], ['2. SYSTEM DECISION', [-0.35, 1.55, 0]], ['3A. HELPED', [2.3, 1.15, -1.5]], ['3B. HARMED', [2.3, 1.15, 1.5], 1]],
    defaultboard: [['1. STANDING PRESETS', [-1.15, 1.78, 0.35]], ['2. REPEATED OUTPUT', [1.15, 1.93, -0.2]], ['3. BURDEN QUEUE', [2.35, 1.54, 0.78], 1]],
    surveillanceflow: [['1. CHECKPOINT', [-2.0, 1.85, 0]], ['2. FLAG CREATED', [-0.55, 1.65, 0.1], 1], ['3. DATABASE', [0.85, 1.65, -0.85]], ['4. NEXT CHECKPOINT', [2.35, 1.75, 0.35]], ['BLOCKED: APPEAL', [0.4, 1.45, 1.6], 1]],
    toolkit: [['1. DATA', [-2.45, 1.68, -0.62]], ['2. RULE / MODEL', [-1.22, 1.68, -0.62]], ['3. DEPLOYMENT', [0, 1.68, -0.62]], ['4. DECISION', [1.22, 1.68, -0.62], 1], ['5. FEEDBACK', [2.45, 1.68, -0.62]]],
    datastory: [['1. AGENCY HOLDS RAW DATA', [-2.1, 1.9, 0]], ['2. APPLY OCAP + CARE', [0.1, 1.88, 0]], ['3. COMMUNITY GOVERNANCE', [2.05, 1.9, 0]], ['4. NAME WHAT MUST MOVE', [0.9, 1.25, 0], 1]],
    promisefunnel: [['1. READ THE PROMISE', [-2.0, 1.95, -0.2]], ['2. X-RAY THE FUNNEL', [0.4, 1.85, -0.2], 1], ['3. ASK WHO GAINS AND WHO IS EXPOSED', [2.15, 1.65, 0.45]]],
    detector: [['THREE ESSAYS', [-2.15, 2.35, 0.1]], ['THE DETECTOR', [0.12, 2.45, -0.1]], ['WHO GETS FLAGGED', [2.25, 1.95, 0.35], 1]],
    thresholdaudit: [['1. SCORE', [-1.95, 1.75, -0.25]], ['2. CUTOFF', [0.15, 1.85, 0], 1], ['3A. SUPPORT', [1.8, 1.55, -0.95]], ['3B. JUST MISSED IT', [1.15, 1.75, 1.35], 1], ['4. HUMAN REVIEW', [1.15, 0.85, 1.35]]],
    repairtable: [['1. NAME THE HARM', [0, 1.55, 0]], ['2A. PATCH', [-1.65, 1.35, -0.9]], ['2B. REAL REPAIR', [1.65, 1.35, -0.9]], ['3. MOVE DECISION AUTHORITY', [1.3, 1.25, 0.7]]],
    policydeck: [['1. CHOOSE POLICY LEVERS', [-0.4, 2.15, 0.35]], ['2. TEST WHAT EACH FIXES', [2.3, 1.75, -0.2]], ['3. FIND THE GAP LEFT OVER', [0.9, 1.15, -0.75], 1]],
    capstonemap: [['1. WEEK 1 ENTRY', [-2.1, 1.75, 0]], ['2. LATER ENTRY', [-0.45, 1.75, 0]], ['3. NAME WHAT CHANGED', [-1.28, 2.05, 0]], ['4. BUILD YOUR FINAL PLAN', [1.55, 1.05, 0]]],
    futurecompass: [['1. SET YOUR COMPASS', [-1.7, 1.45, -0.3]], ['2. EVIDENCE', [-0.35, 0.95, 0.35]], ['3. RESPONSE', [0.75, 1.05, -0.05]], ['4. COMMITMENT', [1.9, 1.15, -0.45]], ['YOUR FIELD, AHEAD', [2.85, 1.95, -0.85]]]
  };
  /* ------------------------------------------------------------ dispatcher */
  /* per-kind camera framing: wide dioramas pull back, bench scenes lean in */
  var FRAMES = {
    _default: { scale: 1.1, cam: [3.35, 2.55, 4.6], look: [0, 0.6, 0] },
    outcomelens: { scale: 1.0, cam: [4.22, 3.17, 5.61], look: [0, 0.48, 0], views: { observe: [0, 0], path: [0.015, 0.025], risk: [0.035, -0.045] } },
    mechanismatch: { scale: 1.08, cam: [3.7, 3.25, 6.65], look: [-0.05, 0.86, 0] },
    pipeline: { scale: 1.0, narrowScale: 0.76, cam: [3.65, 2.7, 4.95], look: [0, 0.6, 0] },
    sorting: { scale: 1.0, cam: [3.65, 2.7, 4.95], look: [0, 0.6, 0] },
    compass: { scale: 1.0, cam: [3.6, 2.75, 4.9], look: [0, 0.5, 0] },
    'return': { scale: 1.0, cam: [3.6, 2.8, 4.9], look: [0, 0.85, 0] },
    map: { scale: 1.02, cam: [3.6, 2.65, 4.9], look: [0, 0.55, 0] },
    gate: { scale: 1.04, cam: [3.55, 2.7, 4.85], look: [0, 0.75, 0] },
    review: { scale: 1.05, cam: [3.5, 2.6, 4.8], look: [0, 0.6, 0] },
    policy: { scale: 1.08, cam: [3.45, 2.65, 4.7], look: [0, 0.85, 0] },
    policydeck: { scale: 1.05, cam: [-3.0, 3.1, 5.7], look: [0, 0.8, 0] },
    surveillanceflow: { scale: 1.04, cam: [-4.6, 2.9, 5.0], look: [0, 0.65, 0] },
    decisionpath: { scale: 1.02, cam: [4.15, 3.35, 6.8], look: [0, 0.72, 0] },
    thresholdaudit: { scale: 1.08, cam: [0.15, 2.7, 5.75], look: [0.05, 0.85, 0], views: { predict: [-0.07, 0.03], try: [0, 0], explain: [0.07, -0.02] } },
    capstonemap: { scale: 1.18, cam: [0, 3.25, 6.4], look: [0, 0.72, 0] },
    futurecompass: { scale: 1.26, cam: [-3.15, 2.0, 4.15], look: [0.3, 0.62, -0.1] },
    repairtable: { scale: 1.16, cam: [0, 3.35, 6.3], look: [0, 0.68, 0] },
    repair: { scale: 1.0, cam: [4.55, 2.95, 5.55], look: [-0.35, 0.84, -0.08], views: { observe: [0, 0], path: [0.012, 0.018], risk: [0.02, -0.035] } },
    toolkit: { scale: 1.14, cam: [0, 3.15, 6.35], look: [0, 0.68, 0] },
    startermap: { scale: 1.22, cam: [3.65, 2.45, 4.8], look: [-0.15, 0.65, 0.15] },
    datastory: { scale: 1.12, cam: [0, 3.3, 6.45], look: [0, 0.72, 0] },
    vault: { scale: 1.08, cam: [3.45, 2.6, 4.7], look: [0, 0.8, 0] },
    benevolence: { scale: 1.0, cam: [4.55, 3.05, 5.65], look: [-0.28, 0.78, -0.45], views: { observe: [0, 0], path: [0.012, 0.02], risk: [0.025, -0.035] } },
    promisefunnel: { scale: 1.08, cam: [-4.4, 2.5, 5.2], look: [0, 0.7, 0] },
    detector: { scale: 1.02, cam: [3.55, 2.6, 4.9], look: [0, 0.75, 0], swingRisk: [-0.24, -0.3] },
    switches: { scale: 1.06, cam: [3.5, 2.6, 4.8], look: [0, 0.65, 0] },
    audit: { scale: 0.95, cam: [4.25, 3.15, 5.6], look: [0, 0.6, 0] },
    matchwork: { scale: 1.08, cam: [3.45, 2.55, 4.7], look: [0, 0.55, 0] },
    defaultboard: { scale: 1.06, cam: [-1.8, 3.2, 6.2], look: [0, 0.7, 0] }
  };
  var FAMILY_FRAMES = {
    archive: { cam: [4.75, 3.25, 6.55], look: [0, 0.72, -0.08] },
    garden: { cam: [4.75, 2.2, 5.1], look: [0, 0.62, 0] },
    maze: { cam: [5.15, 4.25, 5.5], look: [0, 0.48, 0] },
    paper: { cam: [0, 2.55, 7.35], look: [0, 0.84, 0] },
    terrain: { cam: [4.95, 4.75, 5.35], look: [0, 0.38, 0] }
  };
  window.BFS218_HOLO = {
    version: 20,
    styleFor: styleFor,
    anchors: ANCHORS,
    activitySignature: function (kind) { return REAL_SIGNATURES[kind] || null; },
    activityAsset: function (kind) { return REAL_ASSETS[kind] || null; },
    frame: function (kind, narrow) {
      var f = FRAMES[kind] || FRAMES._default;
      var family = FAMILY_FRAMES[styleFor(kind)] || FAMILY_FRAMES.maze;
      var cam = (f.cam || family.cam).slice();
      var lookAt = family.look.slice();
      /* Per-kind views remain content-aware, while the family determines the
         dominant viewpoint. Documentary kinds retain their closer scale. */
      if (f.look) {
        lookAt[0] += f.look[0] * 0.16;
        lookAt[1] += (f.look[1] - 0.6) * 0.28;
        lookAt[2] += f.look[2] * 0.16;
      }
      /* Default to a wider, fully readable scene. Reset returns here. */
      var wide = { scale: f.scale * 0.82, cam: cam, look: lookAt, swingRisk: f.swingRisk, views: f.views };
      if (!narrow) return wide;
      var documentary = ['outcomelens', 'benevolence', 'repair'].indexOf(kind) >= 0;
      return { scale: wide.scale * (documentary ? 0.92 : (typeof f.narrowScale === 'number' ? f.narrowScale : 0.78)), cam: [wide.cam[0] * 1.32, wide.cam[1] * 1.18, wide.cam[2] * 1.32], look: wide.look, swingRisk: wide.swingRisk, views: wide.views };
    },
    supports: function (kind) { return !!SCENES[kind]; },
    build: function (THREE, ctx) {
      var realScene = REAL_SCENES[ctx.kind] || null;
      var scene = realScene || SCENES[ctx.kind];
      if (!scene) return null;
      ctx.style = realScene ? 'realist' : styleFor(ctx.kind);
      ctx.root.userData.visualFamily = ctx.style;
      ctx.root.userData.instructionalKind = ctx.kind;
      ctx.root.userData.activityOverhaulSignature = realScene ? REAL_SIGNATURES[ctx.kind] : null;
      var K = makeKit(THREE, ctx);
      if (!realScene) K.environment();
      if (!realScene && ctx.sun) K.shadows(ctx.sun);
      /* Each family gets its own lens, light, and atmosphere. */
      try {
        var looks = {
          archive: { fov: 32, fog: 0x9ca2a2, near: 13, far: 29, exposure: 0.89, hemi: [0xe8e4db, 0x353d40, 0.68], key: [0xffe7c3, 2.16], fill: [0xb7c8cd, 0.38], rim: [0xb8221b, 0.42] },
          garden: { fov: 39, fog: 0xbecf9e, near: 13, far: 28, exposure: 0.92, hemi: [0xffefad, 0x294f3e, 0.72], key: [0xffe09a, 1.68], fill: [0xa9c2ff, 0.58], rim: [0xee5b53, 0.38] },
          maze: { fov: 34, fog: 0xd7d2c8, near: 15, far: 32, exposure: 0.96, hemi: [0xfff1da, 0x3d4446, 0.78], key: [0xffe5bd, 2.0], fill: [0xc7e0e2, 0.56], rim: [0xd2a760, 0.42] },
          paper: { fov: 29, fog: 0xd7c5a2, near: 16, far: 34, exposure: 1.02, hemi: [0xffeac0, 0x2c3f73, 0.76], key: [0xffdda2, 2.3], fill: [0xb9cafa, 0.46], rim: [0xff7900, 0.52] },
          terrain: { fov: 37, fog: 0xd5bac0, near: 15, far: 33, exposure: 0.98, hemi: [0xffedce, 0x5d536c, 0.78], key: [0xffdfb0, 1.88], fill: [0xbce0d6, 0.58], rim: [0xd8755e, 0.4] },
          realist: { fov: 33, fog: 0xa9aaa7, near: 16, far: 34, exposure: 0.94, hemi: [0xf6eee1, 0x343a3d, 0.72], key: [0xffdfbb, 2.18], fill: [0xb9cbd0, 0.46], rim: [0x8f2924, 0.34] }
        };
        var look = looks[ctx.style] || looks.maze;
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
      var sceneController = scene(K, ctx) || null;
      /* Once a student chooses, the scene remembers that prediction without
         covering the instructional model with three context-free letter pads. */
      var pickMeshes = sceneController && sceneController.pickMeshes ? sceneController.pickMeshes.slice() : [];
      if (!realScene && ctx.context === 'activity' && ctx.expOptions && ctx.expOptions.length && typeof ctx.expPick === 'number') {
        var padPos = [[-3.15, 0.02, 2.12], [-3.15, 0.02, 2.12], [-3.15, 0.02, 2.12]];
        var letters = ['A', 'B', 'C'];
        ctx.expOptions.forEach(function (o, i) {
          if (i !== ctx.expPick) return;
          var pos = padPos[i] || padPos[0];
          var chosen = true;
          var padMat = K.mat.plastic(0x2f6f52, 0.56);
          var pad = K.cyl(0.52, 0.58, 0.09, padMat, [pos[0], pos[1] + 0.045, pos[2]]);
          K.torus(0.62, 0.024, K.mat.metal(0x82a993, 0.58), [pos[0], pos[1] + 0.1, pos[2]], [Math.PI / 2, 0, 0], { shadow: false });
          /* Full choice wording remains in the accessible controls below. */
          K.tag('PREDICTION ' + letters[i], [pos[0], 0.72, pos[2]], { warn: false, keepText: true });
        });
      }
      /* A physical result beacon changes with the student's latest simulation. */
      if (!realScene && ctx.context === 'activity' && ctx.simOutcome) {
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
      var tags = realScene ? [] : (typeof TAGS[ctx.kind] === 'function' ? TAGS[ctx.kind](ctx) : (TAGS[ctx.kind] || []));
      for (var tgi = 0; tgi < tags.length; tgi++) {
        try { K.tag(tags[tgi][0], tags[tgi][1], { warn: !!tags[tgi][2], marker: ctx.context === 'activity' }); } catch (e) {}
      }
      K.resolveLabels();
      /* settle one frame at t=0 so static/reduced-motion renders place every animated part */
      for (var ti = 0; ti < K.ticks.length; ti++) { try { K.ticks[ti](0); } catch (e) {} }
      return {
        skipDefaultStage: true,
        pickMeshes: pickMeshes,
        setView: sceneController && sceneController.setMode ? sceneController.setMode : null,
        manipulate: sceneController && sceneController.manipulate ? sceneController.manipulate : null,
        resetManipulation: sceneController && sceneController.resetManipulation ? sceneController.resetManipulation : null,
        manipulationState: sceneController && sceneController.manipulationState ? sceneController.manipulationState : null,
        cameraFor: sceneController && sceneController.cameraFor ? sceneController.cameraFor : null,
        tick: function (t) {
          K.resolveLabels();
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
