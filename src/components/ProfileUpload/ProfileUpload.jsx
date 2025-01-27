import axios from "axios";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

async function getCroppedImg(imageSrc, crop) {
    const image = new Image();
    image.src = imageSrc;

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = crop.width;
            canvas.height = crop.height;

            ctx.drawImage(
                image,
                crop.x, crop.y, crop.width, crop.height,
                0, 0, canvas.width, canvas.height
            );

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob)); // Returns the cropped image as a Blob
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg');
        };

        image.onerror = () => reject(new Error('Failed to load image'));
    });
}


function ProfileUpload({ fileInputRef }) {
    const [image, setImage] = useState(null); // Stores uploaded image
    const [crop, setCrop] = useState({ x: 0, y: 0 }); // Crop position
    const [zoom, setZoom] = useState(1); // Zoom level
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // Stores crop coordinates
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const uid = localStorage.getItem('userId');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                event.target.value = null;
                setIsDialogOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            console.log(croppedImage)

            const blob = await fetch(croppedImage).then((res) => res.blob());
            const file = new File([blob], 'image.jpg', { type: blob.type });

            const formData = new FormData();
            formData.append('userImg', file);
            console.log(formData)

            await axios.post(`${import.meta.env.VITE_BASE_URL}/useruplodimg/${uid}`, formData).then(res => {
                console.log(res.data)
                setIsDialogOpen(false);
            });
        } catch (e) {
            setIsDialogOpen(false);
            console.error('Error:', e);
        }
    };


    return (
        <div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            {isDialogOpen && (
                <div className="cropDialogCont">
                    <div className="crop-dialog">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                        <div className="controls">
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileUpload
