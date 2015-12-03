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
    vl.innerHTML = Math.round(clr.l * 100) + "%";
    out.onkeyup = function() {
        cp.color(this.value);
        cp2.color(this.value);
    };
    // assigning onchange event handler
    var onchange = function(item) {
        return function(clr) {
            //added ... lou king ... swap closest "md" color for pick ...
            var aClr = Raphael.getRGB(clr);
            //console.log("orig color: ", clr + " " + aClr["r"] + " " + aClr["g"] + " " + aClr["b"]);
            // pass in orig color and true to clamp to material design and true to limit to md-primaries...
            clr = grabClosestColor(aClr["r"], aClr["g"], aClr["b"], false, true);
            //console.log("listed color: ", clr);
            cp.color(clr);
            cp2.color(clr);
            //end of add...
            out.value = clr.replace(/^#(.)\1(.)\2(.)\3$/, "#$1$2$3");
            item.color(clr);
            out.style.background = clr;
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
        };
    };
    cp.onchange = onchange(cp2);
    cp2.onchange = onchange(cp);
    // that’s it. Too easy
});
