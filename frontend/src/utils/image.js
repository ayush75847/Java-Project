// Cloudinary can resize images on the fly: we just add options to the URL.
//   .../image/upload/v123/inkly/posts/abc.webp
//   .../image/upload/f_auto,q_auto,c_limit,w_1600/v123/inkly/posts/abc.webp
// f_auto  = best format for this browser (AVIF/WebP)   q_auto = good quality, small file
// c_limit = only shrink, never blow up a small image   w_...  = max width in pixels
// Result: a phone downloads a few hundred KB instead of the original multi-MB photo.

const UPLOAD_PART = "/image/upload/";

export function sizedImage(url, width) {
  // Not a Cloudinary URL (or no image): use it as it is
  if (!url || !url.includes("res.cloudinary.com") || !url.includes(UPLOAD_PART)) return url;
  return url.replace(UPLOAD_PART, `${UPLOAD_PART}f_auto,q_auto,c_limit,w_${width}/`);
}
