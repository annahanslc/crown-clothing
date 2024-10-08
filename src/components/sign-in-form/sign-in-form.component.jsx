import { useState } from "react";
import FormInput from "../form-input/form-input.component";
import "./sign-in-form.styles.jsx";

import {
  signInWithGooglePopup,
  signInAuthUserWithEmailAndPassword,
} from "../../utils/firebase/firebase.utils";
import Button, { BUTTON_TYPE_CLASSES } from "../button/button.component";
import { ButtonsContainer, SignInContainer } from "./sign-in-form.styles.jsx";

const defaultFormFields = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInAuthUserWithEmailAndPassword(email, password);
      resetFormFields();
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Email and password combo is invalid");
      }
      console.log(error);
    }
  };

  return (
    <>
      <SignInContainer>
        <h2>Already have an account?</h2>
        <span>Sign in with your email and password</span>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            onChange={handleChange}
            name="email"
            value={email}
            required
          />
          <FormInput
            label="Password"
            type="password"
            onChange={handleChange}
            name="password"
            value={password}
            required
          />
          <ButtonsContainer>
            <Button type="submit">Sign In</Button>
            <Button
              buttonType={BUTTON_TYPE_CLASSES.google}
              type="button"
              onClick={signInWithGoogle}
            >
              Google Sign In
            </Button>
          </ButtonsContainer>
        </form>
      </SignInContainer>
    </>
  );
};

export default SignInForm;
