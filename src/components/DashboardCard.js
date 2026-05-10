function DashboardCard(props) {
  return (
    <div className="card">
      <h2>{props.title}</h2>

      <p>{props.value}</p>
    </div>
  );
}

export default DashboardCard;