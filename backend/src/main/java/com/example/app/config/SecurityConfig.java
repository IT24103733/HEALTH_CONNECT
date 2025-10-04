package com.example.app.config;

import com.example.app.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/validate").permitAll()
                .requestMatchers("/api/auth/refresh").authenticated()
                .requestMatchers("/api/users/**").hasAnyRole("SYSTEM_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/health-metrics/**").authenticated()
                .requestMatchers("/api/care-plans/**").hasAnyRole("DIETITIAN", "PHYSICIAN", "PATIENT")
                .requestMatchers("/api/appointments/**").hasAnyRole("PATIENT", "PHYSICIAN")
                .requestMatchers("/api/diet-requests/**").hasAnyRole("PATIENT", "DIETITIAN")
                .requestMatchers("/api/support-tickets/**").hasAnyRole("PATIENT", "SUPPORT_STAFF")
                .requestMatchers("/api/compliance/**").hasAnyRole("SYSTEM_ADMIN", "SUPER_ADMIN")
                .requestMatchers("/api/messages/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
