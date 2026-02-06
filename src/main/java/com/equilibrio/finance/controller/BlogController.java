package com.equilibrio.finance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/blog")
public class BlogController {

    @GetMapping
    public String blogIndex(Model model) {
        model.addAttribute("pageTitle", "Blog de Educação Financeira - Equilíbrio Finance");
        model.addAttribute("metaDescription", "Artigos sobre organização financeira, controle de gastos, investimentos e dicas práticas para sua vida financeira.");
        return "blog/index";
    }

    @GetMapping("/{slug}")
    public String blogPost(@PathVariable String slug, Model model) {
        // Mapeia cada slug para seu template correspondente
        String templatePath = "blog/" + slug;

        // Define o título da página baseado no slug
        String pageTitle = switch (slug) {
            case "como-montar-orcamento-mensal" ->
                "Como Montar um Orçamento Mensal - Equilíbrio Finance";
            case "quanto-guardar-por-mes" ->
                "Quanto Guardar por Mês - Equilíbrio Finance";
            case "como-sair-cheque-especial" ->
                "Como Sair do Cheque Especial - Equilíbrio Finance";
            case "erros-comuns-controle-financeiro" ->
                "Erros Comuns no Controle Financeiro - Equilíbrio Finance";
            case "reserva-emergencia-guia-completo" ->
                "Reserva de Emergência: O Guia Completo - Equilíbrio Finance";
            default ->
                "Artigo - Equilíbrio Finance";
        };

        model.addAttribute("pageTitle", pageTitle);
        model.addAttribute("slug", slug);
        return templatePath;
    }

    @GetMapping("/categoria/{categoria}")
    public String blogCategoria(@PathVariable String categoria, Model model) {
        model.addAttribute("pageTitle", "Categoria: " + categoria + " - Equilíbrio Finance");
        model.addAttribute("categoria", categoria);
        return "blog/categoria";
    }
}
