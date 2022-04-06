import {AppBanner} from '../components/navigation/AppBanner';
import {Button} from '../components/Button';
import frontEndConfig from '../config';
export default function Unauthenticated() {
  return (
    <div>
      <div className="relative">
        <AppBanner></AppBanner>
      </div>
      <div className="flex h-screen items-center justify-center flex-col mx-10">
        <div className="flex items-center justify-center flex-col m-10 p-10 rounded-lg shadow-lg">
          <p className="my-2 text-4xl">😔 Unauthenticated.</p>
          <p className="p-5">Please try logging in again.</p>
          <div className="w-full flex justify-center items-center">
            <Button
              className="-mx-0"
              title="Back to Login 📢"
              type="button"
              onClick={() => {
                window.location.href = `${frontEndConfig.url}/`;
              }}
            ></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
