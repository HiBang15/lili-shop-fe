export declare type ObjectFit = 'contain' | 'cover';
export declare type ObjectPosition = ['left' | 'center' | 'right', 'top' | 'center' | 'bottom'];

export interface Size {
    width: number;
    height: number;
}

/**
 * Used to calculate the aspect ratio of the picture
 * @see https://drafts.csswg.org/css-images-3/#sizing-terms
 *
 * ## Glossary
 * ### intrinsic dimensions
 * The size of the picture itself
 *
 * ### specified size
 * User-specified element size
 *
 * ### concrete object size
 * The display size of the image after applying `objectFit`
 *
 * ### default object size
 */
export declare function calculateConcreteRect(style: {
    /** @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit */
    objectFit?: ObjectFit;
    /** @see https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-position */
    intrinsicPosition?: ObjectPosition;
    specifiedPosition?: [number, number];
}, intrinsicSize: Size, specifiedSize: Size): {
    sx: number;
    sy: number;
    sw: number;
    sh: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
};
