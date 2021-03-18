/*
    Provides inherited animations for other classes.
    Animations are for transitions / alert uses.
*/
class animation {
    constructor(id) {
        this._animeBody = document.getElementById(id);

        // bug free animation function from HTTP 203 series
        // https://www.youtube.com/watch?v=9-6CKCz58A8
        function animateTo(element, keyframes, options) {
            const anim = element.animate(keyframes, { ...options, fill: "both" });
            anim.addEventListener("finish", () => {
                anim.commitStyles();
                anim.cancel();
            });
            return anim;
        }

        // Store current Animation
        this._currentAnimations = [];
        this._options_preset = {
            easing: 'linear',
            duration: 550
        };

        // Create animation function off it's keyframes & store it's manifesto
        this._createAnimation = (keyframes, options=this._options_preset) => (newOptions) => {
            options = Object.assign({}, options, newOptions);

            // Create newFrames array that includes preset locations
            let newFrames = [];
            keyframes.forEach(frame => {
                newFrames.push(frame)

                let presetFrame = {};
                let key = Object.keys(frame)[0];
                presetFrame[key] = this._animeBody.style[key];

                if (presetFrame[key]) newFrames.slice(0, 0, presetFrame);
            });
            
            let anim = animateTo(this._animeBody, keyframes, options);

            let manifesto = {
                keyframes,
                options,
            };
            this._currentAnimations.push(manifesto);

            return anim;
        };

        this.animationUp = this._createAnimation ([
            {transform: `translateY(-${this._animeBody.offsetHeight + 500}px)`}
        ])

        this.animationReturn = this._createAnimation ([
            {transform: 'none'}
        ])
        

    }
}

export const Animation = animation;
