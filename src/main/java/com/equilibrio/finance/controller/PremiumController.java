package com.equilibrio.finance.controller;

import com.equilibrio.finance.model.Role;
import com.equilibrio.finance.model.User;
import com.equilibrio.finance.repository.RoleRepository;
import com.equilibrio.finance.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/premium")
public class PremiumController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/upgrade")
    public String upgradePage(Model model, Authentication authentication) {
        if (authentication != null) {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElse(null);
            if (user != null && user.isPremium()) {
                // Usuário já é premium, redirecionar
                return "redirect:/controle/gastos?premium=true";
            }
        }
        model.addAttribute("pageTitle", "Upgrade para Premium - Equilíbrio Finance");
        return "premium/upgrade";
    }

    @PostMapping("/activate")
    public String activatePremium(
            @RequestParam String plan,
            Authentication authentication,
            RedirectAttributes redirectAttributes) {
        
        if (authentication == null) {
            return "redirect:/auth/login";
        }

        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Verificar se já é premium
            if (user.isPremium()) {
                redirectAttributes.addFlashAttribute("info", "Você já é um usuário Premium!");
                return "redirect:/controle/gastos";
            }

            // Buscar role PREMIUM
            Role premiumRole = roleRepository.findByName("ROLE_PREMIUM")
                    .orElseThrow(() -> new RuntimeException("Role PREMIUM não encontrada"));

            // Adicionar role premium ao usuário
            user.addRole(premiumRole);
            userRepository.save(user);

            // NOTA: Em produção, aqui você integraria com gateway de pagamento
            // Por exemplo: Stripe, PayPal, PagSeguro, Mercado Pago, etc.
            // String paymentResult = paymentService.processPayment(user, plan);
            
            redirectAttributes.addFlashAttribute("success", 
                "🎉 Parabéns! Você agora é Premium! Aproveite todos os recursos exclusivos.");
            
            return "redirect:/controle/gastos";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", 
                "Erro ao processar upgrade: " + e.getMessage());
            return "redirect:/premium/upgrade";
        }
    }

    @PostMapping("/cancel")
    public String cancelPremium(
            Authentication authentication,
            RedirectAttributes redirectAttributes) {
        
        if (authentication == null) {
            return "redirect:/auth/login";
        }

        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if (!user.isPremium()) {
                redirectAttributes.addFlashAttribute("info", "Você não possui assinatura Premium ativa.");
                return "redirect:/controle/gastos";
            }

            // Remover role premium
            Role premiumRole = roleRepository.findByName("ROLE_PREMIUM")
                    .orElseThrow(() -> new RuntimeException("Role PREMIUM não encontrada"));
            
            user.getRoles().remove(premiumRole);
            userRepository.save(user);

            redirectAttributes.addFlashAttribute("success", 
                "Assinatura Premium cancelada com sucesso. Você ainda terá acesso até o fim do período pago.");
            
            return "redirect:/controle/gastos";

        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", 
                "Erro ao cancelar assinatura: " + e.getMessage());
            return "redirect:/controle/gastos";
        }
    }
}
