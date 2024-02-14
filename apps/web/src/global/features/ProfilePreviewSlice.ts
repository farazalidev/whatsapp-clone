import { createSlice } from '@reduxjs/toolkit';

interface IProfilePreviewSlice {
  user_id: string | undefined;
}

const initialState: IProfilePreviewSlice = {
  user_id: undefined,
};

const ProfilePreviewSlice = createSlice({
  name: 'profile-preview-slice',
  initialState,
  reducers: {
    setCurrentUserProfilePreview: (state, { payload }: { payload: string | undefined }) => {
      return {
        user_id: payload,
      };
    },
  },
});

export const { setCurrentUserProfilePreview } = ProfilePreviewSlice.actions;
export default ProfilePreviewSlice;
