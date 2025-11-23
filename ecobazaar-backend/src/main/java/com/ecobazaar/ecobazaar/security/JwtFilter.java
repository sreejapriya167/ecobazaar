package com.ecobazaar.ecobazaar.security;

import com.ecobazaar.ecobazaar.util.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // 1. Skip filter for Auth and Docs
        if (path.startsWith("/api/auth/") ||
            path.startsWith("/v3/api-docs") ||
            path.startsWith("/swagger-ui")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Skip filter for Public GET Products
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            if (path.equals("/api/products") || path.matches("^/api/products/\\d+$")) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // 3. Check for Token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        // 4. Validate Token
        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        Claims claims;
        try {
            claims = jwtUtil.getClaims(token);
        } catch (JwtException | IllegalArgumentException e) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Extract User & Role
        String email = claims.getSubject();
        String role = claims.get("role", String.class);
        
        // Normalize role (Ensure it starts with ROLE_)
        String normalizedRole = normalizeRole(role);

        var authority = new SimpleGrantedAuthority(normalizedRole);

        // 6. Create Authentication Object
        var authentication = new UsernamePasswordAuthenticationToken(
                email,
                null,
                Collections.singletonList(authority)
        );

        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        
        // 7. Set Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 👇👇👇 THE SPY BLOCK (DEBUGGING) 👇👇👇
        System.out.println("==================================================");
        System.out.println("🕵️‍♂️ DEBUG SECURITY CONTEXT:");
        System.out.println("   Request Path: " + path);
        System.out.println("   User Email: " + email);
        System.out.println("   Raw Role from Token: " + role);
        System.out.println("   Final Authority Set: " + normalizedRole);
        
        Authentication authCheck = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("   Spring Context Authorities: " + authCheck.getAuthorities());
        System.out.println("==================================================");
        // 👆👆👆 END DEBUG BLOCK 👆👆👆

        filterChain.doFilter(request, response);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "ROLE_USER";
        }
        role = role.trim();
        if (role.startsWith("ROLE_")) {
            return role.toUpperCase();
        }
        return "ROLE_" + role.toUpperCase();
    }
}