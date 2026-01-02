"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppStore } from "../stores/app.store";
import { useUserStore } from "../stores/user.store";
import { useMutation } from "@tanstack/react-query";
import { ChangePasswordAPI, UpdateUserAPI } from "../api/user.api";
import { useDebounceAPI } from "../hooks/useDebounceAPI.hook";


interface UserChangeInfo {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

const AccountSettings = () => {
  const appStore = useAppStore();
  const userStore = useUserStore()

  const [userChangeInfo, setUserChangeInfo] = useState<UserChangeInfo>({});


  const updateUserInfoDebounce = useDebounceAPI(UpdateUserAPI, 400);


  const changePasswordMutation = useMutation({
    mutationFn: ChangePasswordAPI,
    onSuccess: (data) => {
      if(data.ok){
        setUserChangeInfo({
          ...userChangeInfo,
          currentPassword: "",
          newPassword: ""
        })
      }
    },
    onError: (error) => {
      console.log("Error changing password", error);
    },
  })

  const changeEmailMutation = useMutation({
    mutationFn: UpdateUserAPI,
    onSuccess: (data) => {
      if(data.ok){
        setUserChangeInfo({
          ...userChangeInfo,
          currentPassword: "",
          newPassword: ""
        })
        userStore.setUser(data.user);
      }
    },
    onError: (error) => {
      console.log("Error changing password", error);
    },
  })


  useEffect(() => {
    if (userStore.user) {
      setUserChangeInfo({
        name: userStore.user.name,
        email: userStore.user.email,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [userStore.user]);
  

  return (
    <>
      {appStore.isAccountSettings && (
        <section className="flex items-center justify-center w-screen h-screen absolute bg-background/20 select-none">
          <div className="flex flex-col gap-3 items-start justify-start w-[50vw] h-[57vh] bg-background border border-border rounded-xl shadow-lg px-3 py-3 overflow-x-hidden overflow-y-auto">
            <span className="text-white font-medium text-xl">
              Account Settings
            </span>

            <div className="flex items-start justify-start gap-4 w-full">
              <div className="flex flex-col gap-7 items-center justify-between w-[30%]">
                <Image
                  src={"/test.png"}
                  width={150}
                  height={150}
                  alt="Profile Picture"
                  className="rounded-full object-cover"
                />

                <button className="bg-green-400 hover:bg-green-500 rounded-xl px-5 py-2 cursor-pointer hover:font-medium transition-all duration-300 outline-none active:scale-95">Change Profile Pic</button>
              </div>

              <div className="flex flex-col gap-2 text-white itcems-start justify-start h-full w-[70%]">
                <input type="text" className="rounded-lg focus:outline-none focus:ring-1 ring-green-400 bg-background border border-border px-2 py-1 w-full" placeholder="Name" value={userChangeInfo?.name ?? ""} onChange={(e) => {
                  updateUserInfoDebounce.mutate({name: e.target.value})
                  setUserChangeInfo({...userChangeInfo, name: e.target.value})}
                }/>
                <div className="flex w-full items-center justify-center gap-2">   
                  <input type="text" className="rounded-lg focus:outline-none focus:ring-1 ring-green-400 bg-background border border-border px-2 py-1 w-full" placeholder=" Email"value={userChangeInfo?.email ?? ""} onChange={(e) => {
                    setUserChangeInfo({...userChangeInfo, email: e.target.value})}
                  }/>

                  <button className={`px-4 ${changeEmailMutation.isPending || userChangeInfo.email == userStore.user?.email ? "bg-green-800 cursor-default" : "bg-green-400 hover:bg-green-500 active:scale-95 cursor-pointer hover:font-medium"} py-1 rounded-lg text-black transition-all`} disabled={changeEmailMutation.isPending} onClick={()=>{
                    if(!userChangeInfo.email || userChangeInfo.email == userStore.user?.email) return;

                    changeEmailMutation.mutate({email: userChangeInfo.email})
                  }}>{changeEmailMutation.isPending ? "Changing..." : "Change"}</button>
                </div>
                <input type="text" className="rounded-lg focus:outline-none focus:ring-1 ring-green-400 bg-background border border-border px-2 py-1 w-full" placeholder="Current Password" value={userChangeInfo?.currentPassword ?? ""} onChange={(e) => setUserChangeInfo({...userChangeInfo, currentPassword: e.target.value})}/>
                <input type="text" className="rounded-lg focus:outline-none focus:ring-1 ring-green-400 bg-background border border-border px-2 py-1 w-full" placeholder="New Password" value={userChangeInfo?.newPassword ?? ""} onChange={(e) => setUserChangeInfo({...userChangeInfo, newPassword: e.target.value})}/>

                <button className={`${userChangeInfo.newPassword == "" || userChangeInfo.currentPassword == "" || changePasswordMutation.isPending ? "bg-green-800 cursor-default" : "bg-green-400 hover:bg-green-500 active:scale-95 cursor-pointer hover:font-medium"} rounded-xl px-5 py-2 transition-all duration-300 outline-none text-black  mt-4`} disabled={userChangeInfo.newPassword == "" && userChangeInfo.currentPassword == ""} onClick={() => {
                  if(!userChangeInfo.currentPassword || !userChangeInfo.newPassword) return;

                  changePasswordMutation.mutate({
                    currentPassword: userChangeInfo.currentPassword,
                    newPassword: userChangeInfo.newPassword
                  })
                }}>{changePasswordMutation.isPending ? "Changing Password..." : "Change Password"}</button>
              </div>
            </div>

            <button className="bg-foreground border border-border text-white rounded-xl px-5 py-2 cursor-pointer hover:font-medium transition-all duration-300 outline-none hover:bg-foreground/90 active:scale-95 mt-4 self-end" onClick={() => appStore.setIsAccountSettings(false)}>Close</button>
          </div>
        </section>
      )}
    </>
  );
};

export default AccountSettings;
