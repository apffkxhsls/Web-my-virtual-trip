function setupPhotoLightbox(photos, lightbox) {
    const frame = lightbox.querySelector(".photo-lightbox-frame");
    const image = frame.querySelector("img");
    const closeButton = lightbox.querySelector(".photo-lightbox-close");
    let openPhoto = null;

    function showPhoto(photo) {
        openPhoto = photo;
        image.setAttribute("src", photo.src);
        image.setAttribute("alt", photo.alt);
        lightbox.style.display = "flex";
        closeButton.focus();
    }

    function closePhoto() {
        if (openPhoto === null) {
            return;
        }
        lightbox.style.display = "none";
        openPhoto.focus();
        openPhoto = null;
    }

    function addPhotos(images) {
        for (let i = 0; i < images.length; i++) {
            const photo = images[i];
            photo.setAttribute("tabindex", "0");
            photo.setAttribute("role", "button");
            photo.addEventListener("click", function () {
                showPhoto(photo);
            });
            photo.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    showPhoto(photo);
                }
            });
        }
    }

    closeButton.addEventListener("click", closePhoto);
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox || event.target === frame) {
            closePhoto();
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePhoto();
        }
    });
    addPhotos(photos);
    return addPhotos;
}
