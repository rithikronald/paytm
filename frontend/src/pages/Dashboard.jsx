import { CustomAvatar } from "../components/CustomAvatar";
import { CustomButton } from "../components/CustomButton";
import { LabelInput } from "../components/LabelInput";

export const Dashboard = () => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex w-full border-b-[1px] border-gray-400 p-4 justify-between items-center">
        <p className="text-black text-2xl font-semibold">Payments App</p>
        <div className="flex items-center gap-x-2">
          <p className="text-xl">Hello User</p>
          <CustomAvatar title={"U1"} />
        </div>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex gap-x-3 items-center">
          <p className="text-xl font-semibold">Your Balance</p>
          <p className="text-xl font-semibold">$ 5000</p>
        </div>
        <div className="flex flex-col w-full mt-6">
          <p className="text-xl font-semibold">Users</p>
          <input className="h-12 rounded-lg border-gray-400 border mt-2" />
        </div>

        <div className="flex justify-between items-center border rounded-xl border-gray-400 p-2 mt-10">
          <div className="flex gap-x-3 items-center">
            <CustomAvatar title={"U1"} />
            <p className="font-semibold">User Name</p>
          </div>
          <div className="flex w-[150px]">
            <CustomButton title={"Send Money"} />
          </div>
        </div>
      </div>
    </div>
  );
};
