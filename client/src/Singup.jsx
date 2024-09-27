import { useState, useContext } from "react";
import { Input } from "@material-tailwind/react";
import { AppContext } from "./context/AppContext";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Signup = () => {
  const { signupUser } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await signupUser(formData);
      if (res.user) {
        navigate("/sniper")
      } else {
        navigate("/signup")
      }
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="px-8 flex flex-col py-8 justify-center items-center">
      <h1 className="gradient-bg text-[38px] md:text-[72px] font-bold">Create User</h1>
      <form
        className="bg-[#292929] shadow-bg md:w-[670px] w-full border-b-[6px] border-b-[#34d399] border-t-[6px] rounded-xl border-t-[#34d399] p-4"
        onSubmit={handleSubmit}
      >
        <div className="flex-col w-full flex justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Name</h1>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            color="teal"
            className="rounded-lg bg-gray-600/30 text-white"
            label="Name"
          />
        </div>
        <div className="flex-col w-full flex justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]"> Last Name</h1>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            color="teal"
            className="rounded-lg bg-gray-600/30 text-white"
            label="Name"
          />
        </div>
        <div className="flex-col w-full flex mt-5 justify-start gap-2 items-start ">
          <h1 className="text-white text-[14px] md:text-[18px]">Email</h1>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            color="teal"
            className="rounded-lg bg-gray-600/30 text-white"
            label="Email"
          />
        </div>
        <div className="flex-col w-full flex mt-5 justify-start gap-2 items-start relative">
          <h1 className="text-white text-[14px] md:text-[18px]">Password</h1>
          <div className="relative w-full">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              color="teal"
              className="rounded-lg bg-gray-600/30 text-white pr-12"
              label="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
            >
              {showPassword ? (
                <VisibilityIcon className="text-white" />
              ) : (
                <VisibilityOffIcon className="text-white" />
              )}
            </button>
          </div>
        </div>

        <button
          className="group/button relative w-[95%] left-[2%] mt-5 inline-flex items-center justify-center overflow-hidden rounded-md bg-grade backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-[#09f774]/30 border border-[#09f774]/20"
          type="submit"
        >
          <span className="text-lg">Sign Up</span>
          <div
            className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
          >
            <div className="relative h-full w-10 bg-[white]/30"></div>
          </div>
        </button>
      </form>

    </div>
  );
};

export default Signup;
