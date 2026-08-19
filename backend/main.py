from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
from routers import auth, equipment, bookings, users, providers
from websocket_routes import router as ws_router

app = FastAPI(
    title="Agri-Rent API",
    description="Backend for the Agri-Rent agricultural equipment rental platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(equipment.router)
app.include_router(bookings.router)
app.include_router(users.router)
app.include_router(providers.router)
app.include_router(ws_router)


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "🌾 Agri-Rent API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}

