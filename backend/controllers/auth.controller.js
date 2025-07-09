import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { sendWelcomeEmail } from "../utils/notificationService.js";

function passwordValidation(password) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Todos los campos son requeridos" });
    }

    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email no valido" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "La contraseña debe por lo menos 6 caracteres",
      });
    }

    // Verificar si la contraseña es común
    const commonPasswords = [
      "123456",
      "password",
      "123456789",
      "qwerty",
      "abc123",
      "password1",
      "12345",
    ];

    if (commonPasswords.includes(password)) {
      return res.status(400).json({
        success: false,
        message:
          "La contraseña es demasiado común. Por favor, elige una contraseña más segura.",
      });
    }

    // Validar complejidad de la contraseña
    if (!passwordValidation(password)) {
      return res.status(400).json({
        success: false,
        message:
          "La contraseña debe contener al menos una letra mayúscula, un número y un carácter especial",
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "El email ya existe" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res
        .status(400)
        .json({ success: false, message: "El usuario ya existe" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const PROFILE_PICS = [
      "/avatar1.png",
      "/avatar2.png",
      "/avatar3.png",
      "/avatar4.png",
    ];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      image,
      onboarded: false,
    });

    generateTokenAndSetCookie(newUser._id, res);
    await newUser.save();

    await sendWelcomeEmail(email, username);

    res.status(201).json({
      success: true,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (error) {
    console.log("Error en signup controller", error.message);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Todos los campos son requeridos" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Credenciales incorrectas" });
    }

    // Actualizamos lastActive
    user.lastActive = new Date();
    await user.save();

    generateTokenAndSetCookie(user._id, res);

    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: "" } });
  } catch (error) {
    console.log("Error en login controller", error.message);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("jwt-prototipo", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res
      .status(200)
      .json({ success: true, message: "Cierre de sesion exitoso" });
  } catch (error) {
    console.log("Error en logout controller", error.message);
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}

export async function authCheck(req, res) {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    console.log("Error en authCheck controller");
    res.status(500).json({ success: false, message: "Error en el servidor" });
  }
}

export async function updatePreferences(req, res) {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Verificamos si el usuario ya completó el onboarding
    if (user.onboarded) {
      return res
        .status(400)
        .json({ message: "El onboarding ya ha sido completado." });
    }

    user.preferences = preferences;
    user.onboarded = true;
    await user.save();

    res.status(200).json({
      success: true,
      onboarded: user.onboarded,
      message: "Preferencias del usuario actualizadas correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al guardar las preferencias",
      error,
    });
  }
}
