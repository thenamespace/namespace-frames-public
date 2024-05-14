import { backgroundStyle, bluePrimary } from "./styles";

export const ErrorImage = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div
      style={{
        ...backgroundStyle,
        background: bluePrimary,
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: "100px",
        alignItems: "flex-start",
      }}
    >
      <p style={{ fontSize: 120, color: "white" }}>:(</p>
      <p style={{ fontSize: 45, color: "white" }}>{title}</p>
      {subtitle && <p style={{ fontSize: 30, color: "white" }}>{subtitle}</p>}
    </div>
  );
};
