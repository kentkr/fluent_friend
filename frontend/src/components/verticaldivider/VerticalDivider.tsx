import { VerticalDividerProps } from './VerticalDivider.d'

const VerticalDivider: React.FC<VerticalDividerProps> = ({
  height = '50%',
  color = '#e0e0e0',
  thickness = 1,
  margin = '0 8px',
  className = ''
}) => {
  return (
    <div
      className={className}
      style={{
        width: thickness,
        height: height,
        backgroundColor: color,
        margin: margin,
        flexShrink: 0
      }}
    />
  );
};

export default VerticalDivider
