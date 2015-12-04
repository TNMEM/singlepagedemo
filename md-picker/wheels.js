Raphael(function() {
    // get the elements...
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
        mdc = document.getElementById("mdColors"),
        mdm = document.getElementById("mdMain"),
        // create colorpicker...
        cp = Raphael.colorpicker(40, 20, 300, "#eee"),
        cp2 = Raphael.colorwheel(360, 20, 300, "#eee"),
        clr = Raphael.color("#eee");
    // set initial values...
    vr.innerHTML = clr.r;
    vg.innerHTML = clr.g;
    vb.innerHTML = clr.b;
    vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
    vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
    vv.innerHTML = Math.round(clr.v * 100) + "%";
    vl.innerHTML = Math.round(clr.l * 100) + "%";
    h1.innerHTML = "Color Picker";

    // get the json file with the material design colors...
    var colors;
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

    function setDials(clr) {
        clr = Raphael.color(clr);
        vr.innerHTML = clr.r;
        vg.innerHTML = clr.g;
        vb.innerHTML = clr.b;
        vh.innerHTML = vh2.innerHTML = Math.round(clr.h * 360) + "°";
        vs.innerHTML = vs2.innerHTML = Math.round(clr.s * 100) + "%";
        vv.innerHTML = Math.round(clr.v * 100) + "%";
        vl.innerHTML = Math.round(clr.l * 100) + "%";
    }

    // onchange event handler...
    var onchange = function(item) {
        return function(clr) {
            console.log("onchange:");
            console.log(clr);
            if (mdc.checked == true) {
                // returns array of [rgbString, mdColorName, mdTinkNumber]...
                var tmp = calcColor(clr);
                clr = tmp[0];
                h1.innerHTML = tmp[1] + " (" + tmp[2] + ")";
                cp.color(clr);
                cp2.color(clr);
            }
            else {
                h1.innerHTML = "Color Picker";
            }
                    out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
        item.color(clr);
        //out.style.background = clr;
        out.style.background = "white";
        //out.style.color = Raphael.rgb2hsb(clr).b < .5 ? "#fff" : "#000";
        out.style.color = "gray";
            setDials(clr);
        };
    };
    // handle color pickers...
    cp.onchange = onchange(cp2);
    cp2.onchange = onchange(cp);
    // handle hex/name box...
    out.onkeyup = function() {
        h1.innerHTML = "Manual";
        cp.color(this.value);
        cp2.color(this.value);
        setDials(this.value);
    };

    // calculate closest color based on material color design: just primaries or all...
    function calcColor(clr) {
        //console.log("calcColor: ", clr);
        clr = Raphael.color(clr);
        //console.log(clr);
        var diff = Number.MAX_VALUE;
        var tDiff, closest, obj, key, tint, anRGB;
        for (key in colors) {
            if (colors.hasOwnProperty(key)) {
                obj = colors[key];
                for (tint in obj) {
                    if (obj.hasOwnProperty(tint)) {
                        // need to fix this ... always searches all colors...
                        if (mdm.checked == true && tint.substr(0, 4) == "P500") {
                            anRGB = Raphael.getRGB(obj[tint]);
                        }
                        else if (mdm.checked == false /*&& tint.substr(0, 1) == "A" */ ) {
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
                            closest = [anRGB["r"], anRGB["g"], anRGB["b"], key, tint];
                            console.log("replaced:");
                            console.log(closest);
                        }
                    }
                }
            }
        }
        return ([Raphael.rgb(closest[0], closest[1], closest[2]), closest[3], closest[4]]);
    }
});
