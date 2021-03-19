/*
    Provides inherited animations for other classes.
    Animations are for transitions / alert uses.
*/
class animation {
    constructor(id) {
        // Animation body for animation target
        this._animeBody = document.getElementById(id);

        // Store current Animation
        this.__currentAnimations = [];
        this.__optionsPreset = {
            easing: 'linear',
            duration: 350
        };


        let originalDisplay = this._computed('display')
        this.appear = this.__createAnimation__({
            keyframes: [
                {opacity: 'target'},
                {opacity: 1}
            ],
            before: (kf) => {
                this._animeBody.style.display = originalDisplay;
                kf[0]['opacity'] = this._computed('opacity');
                return kf
            }
        })

        this.disappear = this.__createAnimation__({
            keyframes: [
                {opacity: 'target'},
                {opacity: 0}
            ],
            before: (keyframes) => {
                keyframes[0]['opacity'] = this._computed('opacity');
                return keyframes
            },
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

            // Perform animation & before / after events
            if (before && typeof before === 'function') keyframes = before(keyframes);
            let anim = this.__animateTo__(this._animeBody, keyframes, options);
            if (after && typeof after === 'function') anim.addEventListener('finish', after)

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