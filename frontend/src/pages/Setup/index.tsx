import React, { useEffect, useRef, useState, ChangeEvent } from "react";

import { createUser } from "api/npm";
import { Alert, Button } from "components";
import { LocalePicker } from "components";
import { useAuthState, useHealthState } from "context";
import { intl } from "locale";

import logo from "../../img/logo-text-vertical-grey.png";

function Setup() {
	const nameRef = useRef(null);
	const { refreshHealth } = useHealthState();
	const { login } = useAuthState();
	const [loading, setLoading] = useState(false);
	const [renderCount, setRenderCount] = useState(0);
	const [errorMessage, setErrorMessage] = useState("");

	const [formData, setFormData] = useState({
		name: "",
		nickname: "",
		email: "",
		password: "",
	});

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage("");

		const { password, ...payload } = {
			...formData,
			...{
				isDisabled: false,
				roles: ["admin"],
				auth: {
					type: "password",
					secret: formData.password,
				},
			},
		};

		try {
			const response = await createUser({ payload });
			if (response && typeof response.id !== "undefined" && response.id) {
				// Success, Login using creds
				try {
					await login(response.email, password);
					// Trigger a Health change
					refreshHealth();
					// window.location.reload();
				} catch (err: any) {
					setErrorMessage(err.message);
					setLoading(false);
				}
			} else {
				setErrorMessage("Unable to create user!");
			}
		} catch (err: any) {
			setErrorMessage(err.message);
		}
		setLoading(false);
	};

	const onChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [target.name]: target.value });
	};

	useEffect(() => {
		// @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
		nameRef.current.focus();
	}, []);

	return (
		<div className="page page-center">
			<div className="container-tight py-4">
				<div className="text-center mb-4">
					<img src={logo} alt="Logo" />
				</div>
				<form
					className="card card-md"
					method="post"
					autoComplete="off"
					onSubmit={onSubmit}>
					<div className="card-body">
						<div className="row mb-4">
							<div className="col">
								<h2 className="card-title">
									{intl.formatMessage({
										id: "setup.title",
										defaultMessage: "Create your first Account",
									})}
								</h2>
							</div>
							<div className="col col-md-2">
								<LocalePicker
									onChange={() => {
										setRenderCount(renderCount + 1);
									}}
								/>
							</div>
						</div>

						{errorMessage ? (
							<Alert type="danger" className="text-center">
								{errorMessage}
							</Alert>
						) : null}

						<div className="mb-3">
							<label className="form-label">
								{intl.formatMessage({
									id: "user.name",
									defaultMessage: "Name",
								})}
							</label>
							<input
								ref={nameRef}
								onChange={onChange}
								className="form-control"
								name="name"
								value={formData.name}
								disabled={loading}
								placeholder={intl.formatMessage({
									id: "user.name",
									defaultMessage: "Name",
								})}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">
								{intl.formatMessage({
									id: "user.nickname",
									defaultMessage: "Nickname",
								})}
							</label>
							<input
								onChange={onChange}
								className="form-control"
								name="nickname"
								value={formData.nickname}
								disabled={loading}
								placeholder={intl.formatMessage({
									id: "user.nickname",
									defaultMessage: "Nickname",
								})}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">
								{intl.formatMessage({
									id: "user.email",
									defaultMessage: "Email",
								})}
							</label>
							<input
								type="email"
								onChange={onChange}
								className="form-control"
								name="email"
								value={formData.email}
								disabled={loading}
								placeholder={intl.formatMessage({
									id: "user.email",
									defaultMessage: "Email",
								})}
								maxLength={150}
								required
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">
								{intl.formatMessage({
									id: "user.password",
									defaultMessage: "Password",
								})}
							</label>
							<input
								type="password"
								onChange={onChange}
								className="form-control"
								name="password"
								value={formData.password}
								disabled={loading}
								placeholder={intl.formatMessage({
									id: "user.password",
									defaultMessage: "Password",
								})}
								minLength={8}
								maxLength={100}
								autoComplete="off"
								required
							/>
						</div>
						<div className="form-footer">
							<Button color="cyan" loading={loading} className="w-100">
								{intl.formatMessage({
									id: "setup.create",
									defaultMessage: "Create Account",
								})}
							</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Setup;