import React from "react"
import ImageUploading, { ImageListType } from "react-images-uploading"
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload"
import CloseIcon from "@mui/icons-material/Close"

interface AvatarUploaderProps {
  avatar: string
  setAvatar: (val: string) => void
  images: any[]
  setImages: (val: any[]) => void
}

const AvatarUploader = ({ avatar, setAvatar, images, setImages }: AvatarUploaderProps) => {
  const maxNumber = 69

  const onChange = (imageList: ImageListType, addUpdateIndex: number[] | undefined) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    setImages(imageList as any[])
    if (imageList && imageList.length) {
      setAvatar(imageList[0].dataURL || "")
    }
  }

  return (
    <div>
      <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
        {({
          imageList,
          onImageUpload,
          // onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="upload__image-wrapper">
            {(!avatar || !imageList || !imageList.length) && (
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                className="avatar-dropper"
                {...dragProps}
              >
                <DriveFolderUploadIcon sx={{ color: "white", fontSize: "35px" }} />
              </button>
            )}
            {(!images || !images.length) && avatar && <img src={avatar} alt="avatar" />}
            {/* <button onClick={onImageRemoveAll}>Cancel</button> */}
            {imageList.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image.dataURL || avatar} alt="avatar" />
                <div className="image-item__btn-wrapper">
                  <button
                    className="avatar-dropper avatar-dropper-update"
                    onClick={() => onImageUpdate(index)}
                  />
                  <button
                    onClick={() => {
                      onImageRemove(index)
                      setAvatar("")
                    }}
                    className="avatar-dropper-remove"
                  >
                    <CloseIcon sx={{ color: "darkgray" }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ImageUploading>
    </div>
  )
}

export default AvatarUploader
