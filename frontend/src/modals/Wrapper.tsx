import React from "react";
import { ReactNode, RefObject, useEffect } from "react";

interface Props {
  children: ReactNode;
  modalRef: RefObject<HTMLElement>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wrapper = ({ children, modalRef, setOpenModal }: Props) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setOpenModal(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [setOpenModal, modalRef]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.2)]">
      {children}
    </div>
  );
};

export default Wrapper;
