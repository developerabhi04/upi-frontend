import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Home } from "@mui/icons-material";

const NotFound = () => {
    return (
        <Container
            maxWidth="md"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
            }}

        >
            <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold", color: "#c8102e" }}>
                404
            </Typography>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Oops! The page you're looking for doesn't exist.
            </Typography>
            <Box sx={{
                color: "#c8102e"
            }}>
                <Button
                    variant="contained"
                    startIcon={<Home />}
                    href="/"
                    sx={{
                        backgroundColor:"#fff",
                        color: "#c8102e"
                    }}
                    
                >
                    Go Home
                </Button>
            </Box>
        </Container>
    );
};

export default NotFound;
