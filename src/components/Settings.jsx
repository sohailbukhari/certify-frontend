import { useCallback, useEffect, useState, useRef } from "react";
import http from "../utils/http";
import { getUser, getAccessToken } from "../utils/storage";
import { toast } from "react-toastify";

const Auth = () => {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetcher("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: oldPasswordRef.current.value,
          newPassword: newPasswordRef.current.value,
        }),
      });
      toast.success("Your password has been updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
      oldPasswordRef.current.value = "";
      newPasswordRef.current.value = "";
    }
  }, []);

  return (
    <section className="card">
      <h4 className="font-bold, font-black">Change Password</h4>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          autoComplete="current-password"
          ref={oldPasswordRef}
          label="Old Password"
          placeholder="Old Password"
          className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
        />
        <input
          type="password"
          autoComplete="new-password"
          ref={newPasswordRef}
          label="New Password"
          placeholder="New Password"
          className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
        />
        <button
          type="submit"
          className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          loading={isLoading}
        >
          Save
        </button>
      </form>
    </section>
  );
};

//update profile and profile picture
const AboutYou = ({ user, mutate }) => {
  const usernameRef = useRef();
  const nameRef = useRef();
  const companyRef = useRef();
  const bioRef = useRef();
  const cnicRef = useRef();
  const phoneRef = useRef();
  const profilePictureRef = useRef();
  const skillsRef = useRef();

  const [avatarHref, setAvatarHref] = useState(user.profilePicture);
  const onAvatarChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setAvatarHref(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        const formData = new FormData();
        //formData.append("username", usernameRef.current.value);
        formData.append("name", nameRef.current.value);
        formData.append("bio", bioRef.current.value);
        user?.userrole == "hirer"
          ? formData.append("company", companyRef.current.value)
          : formData.append("cnic", cnicRef.current.value);
        formData.append("phone", phoneRef.current.value);
        formData.append("skills", skillsRef.current.value);

        if (profilePictureRef.current.files[0]) {
          formData.append("profilePicture", profilePictureRef.current.files[0]);
        }
        //alert(formData);
        const response = await fetcher("https://certify.cyclic.app/profiles", {
          method: "PATCH",
          body: formData,
        });
        mutate({ user: response.user }, false);
        toast.success("Your profile has been updated");
      } catch (e) {
        toast.error(e.message);
      } finally {
        setIsLoading(false);
      }
    },
    [mutate]
  );

  useEffect(() => {
    usernameRef.current.value = user.username;
    nameRef.current.value = user.name;
    bioRef.current.value = user.bio;
    phoneRef.current.value = user.phone;
    skillsRef.current.value = user.skills;
    user?.userrole == "hirer"
      ? (companyRef.current.value = user.company)
      : (cnicRef.current.value = user.cnic);
    profilePictureRef.current.value = "";
    setAvatarHref(user.profilePicture);
  }, [user]);

  return (
    <section className={styles.card}>
      <h4 className={styles.sectionTitle}>About You</h4>
      <h2>
        Your Role :{" "}
        <strong style={{ "text-transform": "uppercase" }}>
          {user.userrole}
        </strong>
      </h2>
      <Spacer size={0.5} axis="vertical" />
      <form onSubmit={onSubmit}>
        <Input ref={usernameRef} label="Your Username" />
        <Spacer size={0.5} axis="vertical" />
        <Input ref={nameRef} label="Your Name" />
        <Spacer size={0.5} axis="vertical" />
        <Input ref={phoneRef} label="Your Phone" />
        {user?.userrole == "hirer" ? (
          <>
            <Spacer size={0.5} axis="vertical" />
            <Input ref={companyRef} label="Company Name" />
          </>
        ) : (
          <>
            <Spacer size={0.5} axis="vertical" />
            <Input ref={cnicRef} label="Your CNIC" />
          </>
        )}
        <Spacer size={0.5} axis="vertical" />
        <Textarea ref={bioRef} label="Your Bio" />
        <Spacer size={0.5} axis="vertical" />
        <span className={styles.label}>Your Avatar</span>
        <div className={styles.avatar}>
          <Avatar size={96} username={user.username} url={avatarHref} />
          <input
            aria-label="Your Avatar"
            type="file"
            accept="image/*"
            ref={profilePictureRef}
            onChange={onAvatarChange}
          />
        </div>
        <Spacer size={0.5} axis="vertical" />
        <Button
          htmlType="submit"
          className={styles.submit}
          type="success"
          loading={isLoading}
        >
          Save
        </Button>
      </form>
    </section>
  );
};

const Settings = () => {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const user = getUser();
  const access_token = getAccessToken();
  //console.log(access_token);
  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const address = `https://certify.cyclic.app/profiles/me`;
        const res = await http.get(address, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        });
        setData(res.data.data);
        //console.log("result.entries", res.data);
        //toast.success("Login successful");
      } catch (err) {
        if (err.response.status === 401) {
          toast.error("Invalid email or password");
        } else toast.error("Oops! Something went wrong");
      }
    };
    getItems();
  }, []);
  return (
    <div>
      {data != null ? (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <div>
                <img
                  className="h-28 w-28 rounded-full"
                  src={data.image}
                  alt=""
                />
              </div>
              <p>User name: {data.name}</p>
              <p>Cnic : {data.cnic}</p>
              <p>Phone : {data.phone}</p>
              <p>Balance : {data.balance}</p>
              <p>
                Skills :
                {data.skills.length > 0
                  ? data.skills.map((skill) => <span> {skill}, </span>)
                  : "  Nill"}
              </p>
              <div>
                <button
                  className="text-white my-5 bg-[#3b5998] hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2"
                  onClick=""
                >
                  Update Profile
                </button>
              </div>
            </div>
            <div>
              <div className="bg: from-slate-500 to-slate-800 py-10">
                <Auth user={data} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>{isLoading}</p>
      )}
    </div>
  );
};
export default Settings;
