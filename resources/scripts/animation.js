/*
    Provides inherited animations for other classes.
    Animations are for transitions / alert uses.
*/
class animation {
    constructor(id) {
        // Animation body for animation target
        this._animeBody = document.getElementById(id);
        console.log(this._computed('display'), this._animeBody)
        let display = this._computed('display')

        // Store current Animation
        this.__currentAnimations = [];
        this.__optionsPreset = {
            easing: 'linear',
            duration: 350
        };

        this.appear = this.__createAnimation__({
            keyframes: [
                {opacity: 0},
                {opacity: 1}
            ],
            before: () => {
                this._animeBody.style.display = display;
            }
        })

        this.disappear = this.__createAnimation__({
            keyframes: [
                {opacity: 1},
                {opacity: 0}
            ],
            after: () => {
                this._animeBody.style.display = 'none';
            }
        })
    }

    // Return either computed object or specific property
    _computed (property) {
        let setStyle = this._animeBody.style[property];
        if (setStyle) return setStyle

        let computed = window.getComputedStyle(this._animeBody);

        if (property && typeof property === 'string') {
            return computed.getPropertyValue(property)
        }

        return computed
    }


    // 'bug free' animation function from HTTP 203 series
    // https://www.youtube.com/watch?v=9-6CKCz58A8
    __animateTo__ (element, keyframes, options) {
        const anim = element.animate(keyframes, { ...options, fill: 'both' });
        anim.addEventListener('finish', () => {
            anim.commitStyles();
            anim.cancel();
        })
        return anim;
    }

    // Returns an animation function
    __createAnimation__ ({keyframes, oldOptions=this.__optionsPreset, before, after}) {
        return (newOptions) => {
            // Combine options
            let options = Object.assign({}, oldOptions, newOptions);

            // Perform animation & after event
            if (before && typeof before === 'function') before();
            let anim = this.__animateTo__(this._animeBody, keyframes, options);
            if (after && typeof after === 'function') setTimeout(anim.addEventListener('finish', after), 100)

            // Save manifesto
            this.__currentAnimations.push({
                keyframes: keyframes,
                options: options,
            });

            return anim;
        }
    }
}

export const Animation = animation;