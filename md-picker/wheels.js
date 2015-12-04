Raphael(function() {
    var out = document.getElementById("output"),
        vr = document.getElementById("vr"),
        vg = document.getElementById("vg"),
        vb = document.getElementById("vb"),
        vh = document.getElementById("vh"),
        vh2 = document.getElementById("vh2"),
        vs = document.getElementById("vs"),
        vs2 = document.getElementById("vs2"),
        vv = document.getElementById("vv"),
        vl = document.getElementById("vl"),
        h1 = document.getElementById("h1"),
        // this is where colorpicker created
        cp = Raphael.colorpicker(40, 20, 300, "#eee"),
        cp2 = Raphael.colorwheel(360, 20, 300, "#eee"),
        clr = Raphael.color("#eee");
    vr.innerHTML = clr.r;
    vg.innerHTML = clr.g;
    vb.innerHTML = clr.b;
    vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
    vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
    vv.innerHTML = Math.round(clr.v * 100) + "%";
    vl.innerHTML ="Color Picker";
    out.onkeyup = function() {
        cp.color(this.value);
        cp2.color(this.value);
    };
    var colors;
    var primary = true;

    getColors();

    function getColors() {
        var gc = $.ajax({
            type: 'GET',
            url: "md-colors.json",
            dataType: 'json'
        });
        gc.fail(function(xhr, type) {
            console.log('gc.fail:');
            console.log(xhr, type);
        });
        gc.done(function(response) {
            console.log('gc.done:');
            console.log(response);
            colors = response;
        });
    }

    // assigning onchange event handler
    var onchange = function(item) {
        return function(clr) {
            clr = Raphael.color(clr);
            console.log(clr);
            console.log("args: ", clr.r, clr.g, clr.b, primary);
            var diff = Number.MAX_VALUE;
            var tDiff, closest, obj, key, tint, anRGB;
            for (key in colors) {
                if (colors.hasOwnProperty(key)) {
                    obj = colors[key];
                    for (tint in obj) {
                        if (obj.hasOwnProperty(tint)) {
                            // need to fix this ... even on primary, no compares are pruned...
                            if (primary == true) {
                                anRGB = Raphael.getRGB(colors[key].P500);
                            }
                            else if (tint.substr(0, 1) == "A") {
                                anRGB = Raphael.getRGB(obj[tint]);
                            }
                            else {
                                continue;
                            }
                            //console.log("A Color: ", key, tint, obj[tint]);
                            tDiff = Math.sqrt(Math.pow(((clr.r - anRGB["r"])), 2) + Math.pow(((clr.g - anRGB["g"])), 2) + Math.pow(((clr.b - anRGB["b"])), 2));
                            //console.log("compare: ", anRGB["r"] + " " + anRGB["g"] + " " + anRGB["b"]);
                            //console.log("tDiff: ", tDiff);
                            if (tDiff < diff) {
                                diff = tDiff;
                                closest = [anRGB["r"], anRGB["g"], anRGB["b"], key];
                                console.log("replaced:");
                                console.log(closest);
                            }
                        }
                    }
                }
            }

            clr = Raphael.rgb(closest[0], closest[1], closest[2]);
            cp.color(clr);
            cp2.color(clr);
            out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
            item.color(clr);
            out.style.background = "white";
            out.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
            clr = Raphael.color(clr);
            vr.innerHTML = clr.r;
            vg.innerHTML = clr.g;
            vb.innerHTML = clr.b;
            vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
            vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
            vv.innerHTML = Math.round(clr.v * 100) + "%";
            vl.innerHTML = Math.round(clr.l * 100) + "%";
            h1.innerHTML = closest[3];
        };
    };
    cp.onchange = onchange(cp2);
    cp2.onchange = onchange(cp);
});
