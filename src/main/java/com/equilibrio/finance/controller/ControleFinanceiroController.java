package com.equilibrio.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/controle")
public class ControleFinanceiroController {

    @GetMapping("/gastos")
    public String controlGastos(Model model) {
        model.addAttribute("pageTitle", "Controle de Gastos - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Registre e organize suas despesas mensais por categoria. Visualize gráficos e tenha controle total dos seus gastos.");
        return "controle/gastos";
    }

    @GetMapping("/receitas")
    public String controleReceitas(Model model) {
        model.addAttribute("pageTitle", "Controle de Receitas - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Registre suas receitas mensais, salários e ganhos extras. Acompanhe seu fluxo de entrada.");
        return "controle/receitas";
    }

    @GetMapping("/metas")
    public String metasFinanceiras(Model model) {
        model.addAttribute("pageTitle", "Metas Financeiras - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Crie e acompanhe suas metas financeiras. Visualize o progresso e alcance seus objetivos.");
        return "controle/metas";
    }
}
