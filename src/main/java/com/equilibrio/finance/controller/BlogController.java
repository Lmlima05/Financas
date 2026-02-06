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
        // Aqui você carregaria o artigo do banco/arquivo
        model.addAttribute("pageTitle", "Artigo - Equilíbrio Finance");
        model.addAttribute("slug", slug);
        return "blog/post";
    }

    @GetMapping("/categoria/{categoria}")
    public String blogCategoria(@PathVariable String categoria, Model model) {
        model.addAttribute("pageTitle", "Categoria: " + categoria + " - Equilíbrio Finance");
        model.addAttribute("categoria", categoria);
        return "blog/categoria";
    }
}
