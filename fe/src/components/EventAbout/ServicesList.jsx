

const ServicesList = ({services}) => {
  if (!services || !services.length) {
    return null
  }

  return (
    <ul className="about__section__text services__list">
      {services.map((service, index) => (
        <li key={index} className="services__item">{service}</li>
      ))}
    </ul>
  )
}

export default ServicesList
