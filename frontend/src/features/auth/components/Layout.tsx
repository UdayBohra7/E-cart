import * as React from "react";

import logoimg from "@/assets/loginimg.png";
import { Head } from "@/components/Head";
import storage from "@/lib/storage";
import { useNavigate } from "react-router-dom";

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const animations = {
  initial: { opacity: 0, x: -1000 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 300 },
};

export const LoginLayout = ({ children, title }: LayoutProps) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if(storage.getToken()) {
      navigate('/admin')    
    }
  },[])
  return (
    <>
      <Head title={title} />
      <div className="d-flex login-layout flex-column  align-content-center justify-content-center">
        <div className="row  w-100 mx-auto">
          <div className="col-md-7 bggrey ">
            <div className="login-left-side h-100vh p-5">
              <h4 className="text-primary f-30">Lorem Ipsum Is a Dummy Content.
              You can used it for dummy purpose only</h4>
              <div className="login-img p-4">
              <img  src={logoimg} className="w-100" alt="Workflow" />
              </div>
            </div>
          </div>
          <div className="col-md-5">
          <div>{children}</div>
          </div>
        </div>
      
      
      </div>
    </>
  );
};
