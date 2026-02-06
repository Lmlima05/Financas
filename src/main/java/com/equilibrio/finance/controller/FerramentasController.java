package com.equilibrio.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/ferramentas")
public class FerramentasController {

    @GetMapping
    public String ferramentasIndex(Model model) {
        model.addAttribute("pageTitle", "Ferramentas Financeiras Gratuitas - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Calculadoras e simuladores financeiros gratuitos para te ajudar no planejamento financeiro.");
        return "ferramentas/index";
    }

    @GetMapping("/calculadora-orcamento")
    public String calculadoraOrcamento(Model model) {
        model.addAttribute("pageTitle", "Calculadora de Orçamento Mensal - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Calcule seu orçamento mensal ideal. Descubra quanto você pode gastar e economizar por mês.");
        model.addAttribute("toolName", "Calculadora de Orçamento Mensal");
        return "ferramentas/calculadora-orcamento";
    }

    @GetMapping("/reserva-emergencia")
    public String reservaEmergencia(Model model) {
        model.addAttribute("pageTitle", "Calculadora de Reserva de Emergência - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Calcule quanto você precisa ter de reserva de emergência baseado no seu custo de vida mensal.");
        model.addAttribute("toolName", "Calculadora de Reserva de Emergência");
        return "ferramentas/reserva-emergencia";
    }

    @GetMapping("/juros-compostos")
    public String jurosCompostos(Model model) {
        model.addAttribute("pageTitle", "Calculadora de Juros Compostos - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Simule o crescimento do seu investimento com juros compostos ao longo do tempo.");
        model.addAttribute("toolName", "Calculadora de Juros Compostos");
        return "ferramentas/juros-compostos";
    }

    @GetMapping("/financiamento")
    public String simuladorFinanciamento(Model model) {
        model.addAttribute("pageTitle", "Simulador de Financiamento - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Simule parcelas de financiamento, calcule juros e veja quanto você vai pagar no total.");
        model.addAttribute("toolName", "Simulador de Financiamento");
        return "ferramentas/financiamento";
    }
}
