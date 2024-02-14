import Typography from "@/Atoms/Typography/Typography"
import OptionIcon from "../Sidebar/OptionIcon"
import ChatPanelHeaderWrapper from "../chat/chatpanel/ChatPanelHeaderWrapper"
import ProfilePreviewUserDetails from "./ProfilePreviewUserDetails"
import { useDispatch } from "react-redux"
import { setCurrentUserProfilePreview } from "@/global/features/ProfilePreviewSlice"
import ProfilePreviewAbout from "./ProfilePreviewAbout"
import ProfilePreviewFiles from "./ProfilePreviewFiles"
import ProfilePreviewOptions from "./ProfilePreviewOptions"

const ProfilePreview = () => {

    const dispatch = useDispatch()


    const handleClose = () => {
        dispatch(setCurrentUserProfilePreview(undefined))
    }

    return <div className="flex flex-col w-full h-full">
        <ChatPanelHeaderWrapper className="flex place-items-center gap-5">
            <OptionIcon src="/icons/x.svg" title="close" onClick={handleClose} />
            <Typography level={3}>Contact Info</Typography>
        </ChatPanelHeaderWrapper>

        {/* User Details */}
        <div className="overflow-y-auto scrollbar flex flex-col gap-2">
            <ProfilePreviewUserDetails />
            <ProfilePreviewAbout />
            <ProfilePreviewFiles />
            <ProfilePreviewOptions />
        </div>
    </div>
}
export default ProfilePreview