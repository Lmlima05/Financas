package com.equilibrio.finance.controller;

import com.equilibrio.finance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String loginPage(@RequestParam(required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("error", "Email ou senha inválidos");
        }
        model.addAttribute("pageTitle", "Login - Equilíbrio Finance");
        return "auth/login";
    }

    @GetMapping("/registro")
    public String registroPage(Model model) {
        model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
        return "auth/registro";
    }

    @PostMapping("/registro")
    public String registrarUsuario(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String nome,
            Model model) {

        try {
            if (userService.emailExists(email)) {
                model.addAttribute("error", "Email já cadastrado");
                model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
                return "auth/registro";
            }

            userService.registerUser(email, password, nome);
            return "redirect:/auth/login?registered=true";

        } catch (Exception e) {
            model.addAttribute("error", "Erro ao criar conta: " + e.getMessage());
            model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
            return "auth/registro";
        }
    }
}
