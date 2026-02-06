package com.equilibrio.finance.controller;

import com.equilibrio.finance.service.RecaptchaService;
import com.equilibrio.finance.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Autowired
    private RecaptchaService recaptchaService;

    @Value("${recaptcha.site-key}")
    private String recaptchaSiteKey;

    @GetMapping("/login")
    public String loginPage(@RequestParam(required = false) String error, Model model) {
        if (error != null) {
            model.addAttribute("error", "Email ou senha inválidos");
        }
        model.addAttribute("pageTitle", "Login - Equilíbrio Finance");
        model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
        return "auth/login";
    }

    @GetMapping("/registro")
    public String registroPage(Model model) {
        model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
        model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
        return "auth/registro";
    }

    @PostMapping("/registro")
    public String registrarUsuario(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String nome,
            @RequestParam(name = "g-recaptcha-response") String recaptchaResponse,
            HttpServletRequest request,
            Model model) {

        try {
            // Validar reCAPTCHA
            String remoteIp = getClientIp(request);
            if (!recaptchaService.verifyRecaptcha(recaptchaResponse, remoteIp)) {
                model.addAttribute("error", "Falha na verificação reCAPTCHA. Por favor, tente novamente.");
                model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
                model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
                return "auth/registro";
            }

            if (userService.emailExists(email)) {
                model.addAttribute("error", "Email já cadastrado");
                model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
                model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
                return "auth/registro";
            }

            userService.registerUser(email, password, nome);
            return "redirect:/auth/login?registered=true";

        } catch (Exception e) {
            model.addAttribute("error", "Erro ao criar conta: " + e.getMessage());
            model.addAttribute("pageTitle", "Criar Conta - Equilíbrio Finance");
            model.addAttribute("recaptchaSiteKey", recaptchaSiteKey);
            return "auth/registro";
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
