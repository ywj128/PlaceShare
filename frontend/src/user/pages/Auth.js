import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try{
      let response;
      if(isLoginMode){
        response = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
      }else{
        response = await fetch("http://localhost:5000/api/users/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
      }
      const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);
        auth.login();
    }catch(err){
      setIsLoading(false);
      setError(err.message || "Something went wraong, please try again.");
    }
  };

  const errorHandler = () => {
    setError(null);
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={errorHandler}/>
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              type="text"
              id="name"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            ></Input>
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            onInput={inputHandler}
            errorText="Please enter a valid email."
          ></Input>
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            errorText="Please enter a valid password (at least 6 characters)."
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
