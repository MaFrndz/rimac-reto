module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hola desde appointment-backend 👋" }),
  };
};

module.exports.createAppointment = async (event) => {
  try {
    const body = JSON.parse(event.body);
    // Aquí podrías validar el body según AppointmentRequest
    return {
      statusCode: 201,
      body: JSON.stringify({ message: "Cita creada correctamente", data: body }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Error en el formato del body", error: error.message }),
    };
  }
};
