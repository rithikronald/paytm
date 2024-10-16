import { CustomButton } from "../components/CustomButton";
import { LabelInput } from "../components/LabelInput";

export const SignIn = () => {
  return (
    <div className="flex flex-1 bg-black/80 justify-center items-center">
      <div className="flex flex-col h-[70%] w-[30%] gap-y-2 p-10 rounded-xl bg-white justify-center items-center">
        <p className="text-black text-3xl font-semibold">Sign In</p>
        <LabelInput title={"Email"} />
        <LabelInput title={"Password"} />
        <CustomButton title={"Sign Up"} />
        <div className="flex mt-2">
          Dont have an account?{" "}
          <button className="bg-white underline ml-1">Sign Up</button>
        </div>
      </div>
    </div>
  );
};
