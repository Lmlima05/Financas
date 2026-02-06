package com.equilibrio.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("pageTitle", "Equilíbrio Finance - Organize seu dinheiro de forma simples");
        model.addAttribute("metaDescription", "Controle seus gastos e alcance seus objetivos financeiros sem planilhas complicadas. Ferramentas gratuitas de organização financeira.");
        return "index";
    }

    @GetMapping("/sobre")
    public String sobre(Model model) {
        model.addAttribute("pageTitle", "Sobre - Equilíbrio Finance");
        return "sobre";
    }
}
