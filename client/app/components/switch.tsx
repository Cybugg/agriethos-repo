// components/Switch.tsx
import React from "react";

type SwitchProps = {
  isOn: boolean | undefined;
  handleToggle: () => void;
  onColor?: string;
};

const Switch: React.FC<SwitchProps> = ({ isOn, handleToggle, onColor = "#96d645" }) => {
  return (
    <div onClick={handleToggle} style={{ cursor: "pointer" }}>
      <div
        style={{
          display: "inline-block",
          width: "50px",
          height: "25px",
          borderRadius: "25px",
          backgroundColor: isOn ? onColor : "#ccc",
          position: "relative",
          transition: "0.3s",
        }}
      >
        <div
          style={{
            content: "",
            position: "absolute",
            top: "2.5px",
            left: isOn ? "26px" : "2.5px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#fff",
            transition: "0.3s",
          }}
        />
      </div>
    </div>
  );
};

export default Switch;
