//Viktor kod
fetchData = () => {
  const baseURL = "http://109.92.116.113:5000/";
  axios
    .post(
      baseURL,
      { email: this.state.email, password: this.state.password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      if (response.data.success) {
        alert(response.data.message);
        this.props.navigation.navigate("Pocetna");
      } else {
        alert(response.data.message);
      }
    });
};
